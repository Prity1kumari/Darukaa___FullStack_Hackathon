import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trees, Leaf, Sparkles, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { formatHectares, formatNumber, formatDate } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddSite: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onAddSite,
}) => {
  const summary = project.summary || {
    site_count: 0,
    total_area_hectares: 0,
    avg_carbon_score: 0,
    avg_biodiversity_score: 0,
    avg_vegetation_index: 0,
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 hover:border-brand-500/40 transition-all duration-200 shadow-lg flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              Active Project
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1.5 group-hover:text-brand-300 transition-colors">
              {project.name}
            </h3>
          </div>
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e3237] transition-colors"
              title="Edit project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1e3237] transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided for this nature initiative.'}
        </p>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#1e3237]/60">
          <div className="p-2 rounded-lg bg-[#0b1315]/60 border border-[#1e3237]/40">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>Sites</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">{summary.site_count}</p>
          </div>

          <div className="p-2 rounded-lg bg-[#0b1315]/60 border border-[#1e3237]/40">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Trees className="w-3 h-3 text-teal-400" />
              <span>Area</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              {formatHectares(summary.total_area_hectares)}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-[#0b1315]/60 border border-[#1e3237]/40">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Biodiversity</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              {formatNumber(summary.avg_biodiversity_score, 1)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-5 pt-3 border-t border-[#1e3237] flex items-center justify-between">
        <button
          onClick={() => onAddSite(project.id)}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Site
        </button>

        <div className="flex items-center space-x-2">
          <Link
            to={`/map?project=${project.id}`}
            className="inline-flex items-center space-x-1 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#1e3237]/60 hover:bg-[#1e3237] transition-all"
          >
            <span>View Map</span>
          </Link>
          <Link
            to={`/projects/${project.id}`}
            className="p-1 rounded-lg text-slate-400 hover:text-brand-300 transition-colors"
            title="Project details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
