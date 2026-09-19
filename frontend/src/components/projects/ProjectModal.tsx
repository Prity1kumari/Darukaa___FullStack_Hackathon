import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Project } from '../../types';
import { useCreateProject, useUpdateProject } from '../../hooks/useProjects';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [projectToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      if (projectToEdit) {
        await updateMutation.mutateAsync({
          id: projectToEdit.id,
          data: { name: name.trim(), description: description.trim() },
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save project');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create Ecological Project'}
      subtitle="Define a carbon and biodiversity initiative to group geographical sites."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Project Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amazonian Primary Canopy Initiative"
            className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe conservation targets, biome types, and community restoration objectives..."
            className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
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
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : projectToEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
