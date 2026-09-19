import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useProjects } from '../../hooks/useProjects';
import { useCreateSite } from '../../hooks/useSites';
import { GeoJSONPolygon } from '../../types';
import { calculateAreaHectares } from '../../utils/geo';

interface SiteCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  initialPolygon?: GeoJSONPolygon | null;
  onCreated?: (newSite: any) => void;
}

export const SiteCreateModal: React.FC<SiteCreateModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
  initialPolygon,
  onCreated,
}) => {
  const { data: projects = [] } = useProjects();
  const createSiteMutation = useCreateSite();

  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [name, setName] = useState('');
  const [ecosystemType, setEcosystemType] = useState('Tropical Rainforest');
  const [status, setStatus] = useState('Active');
  const [polygonJson, setPolygonJson] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultProjectId) setProjectId(defaultProjectId);
    else if (projects.length > 0 && !projectId) setProjectId(projects[0].id);
  }, [defaultProjectId, projects]);

  useEffect(() => {
    if (initialPolygon) {
      setPolygonJson(JSON.stringify(initialPolygon, null, 2));
    } else {
      // Default sample polygon if opened without drawn shape
      const defaultPoly: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-60.1, -3.1],
            [-60.05, -3.1],
            [-60.05, -3.15],
            [-60.1, -3.15],
            [-60.1, -3.1],
          ],
        ],
      };
      setPolygonJson(JSON.stringify(defaultPoly, null, 2));
    }
  }, [initialPolygon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setError('Please select a project');
      return;
    }
    if (!name.trim()) {
      setError('Site name is required');
      return;
    }

    let parsedPolygon: GeoJSONPolygon;
    try {
      parsedPolygon = JSON.parse(polygonJson);
      if (parsedPolygon.type !== 'Polygon' || !Array.isArray(parsedPolygon.coordinates)) {
        throw new Error("Invalid GeoJSON: must be of type 'Polygon'");
      }
    } catch (err: any) {
      setError(`Invalid GeoJSON geometry: ${err.message}`);
      return;
    }

    const calculatedArea = calculateAreaHectares(parsedPolygon);

    try {
      const created = await createSiteMutation.mutateAsync({
        project_id: projectId,
        name: name.trim(),
        ecosystem_type: ecosystemType,
        status,
        polygon: parsedPolygon,
        area: calculatedArea,
      });
      if (onCreated) onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create site');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Geographical Site"
      subtitle="Register a monitored polygon parcel with PostGIS spatial boundary."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Target Project *
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            required
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Site Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acre Canopy Sector A"
            className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Ecosystem Biome
            </label>
            <select
              value={ecosystemType}
              onChange={(e) => setEcosystemType(e.target.value)}
              className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="Tropical Rainforest">Tropical Rainforest</option>
              <option value="Mangrove">Mangrove Delta</option>
              <option value="Peatland">Peatland Bog</option>
              <option value="Temperate Forest">Temperate Forest</option>
              <option value="Savannah">Savannah Grassland</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Monitoring Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="Active">Active Monitoring</option>
              <option value="Restoring">Restoring / Rewilding</option>
              <option value="Monitored">Verified Baseline</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              GeoJSON Polygon Geometry *
            </label>
            <span className="text-[10px] text-brand-400">SRID 4326 (WGS84)</span>
          </div>
          <textarea
            value={polygonJson}
            onChange={(e) => setPolygonJson(e.target.value)}
            rows={5}
            className="w-full font-mono text-xs bg-[#0b1315] border border-[#1e3237] rounded-lg p-3 text-slate-300 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1e3237]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createSiteMutation.isPending}
            className="px-5 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {createSiteMutation.isPending ? 'Persisting Site...' : 'Save Site & Polygon'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
