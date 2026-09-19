import React, { useState } from 'react';
import { Plus, Search, FolderTree, AlertCircle } from 'lucide-react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { SiteCreateModal } from '../components/projects/SiteCreateModal';
import { Loader } from '../components/common/Loader';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { data: projects = [], isLoading } = useProjects();
  const deleteMutation = useDeleteProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [selectedProjectIdForSite, setSelectedProjectIdForSite] = useState<string | undefined>(
    undefined
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this project? All child geographical sites and historical analytics will be removed.'
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const handleAddSite = (projectId: string) => {
    setSelectedProjectIdForSite(projectId);
    setIsSiteModalOpen(true);
  };

  if (isLoading) {
    return <Loader label="Loading projects repository..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Project Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Governing nature conservation frameworks and spatial boundary parcels.
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsProjectModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#121e21] border border-[#1e3237] p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or biome..."
            className="w-full bg-[#0b1315] border border-[#1e3237] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Showing <span className="text-white font-bold">{filteredProjects.length}</span> projects
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#121e21] border border-[#1e3237] rounded-2xl p-12 text-center max-w-lg mx-auto">
          <FolderTree className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            {searchQuery
              ? 'No projects match your current search query.'
              : 'Create your first conservation project or seed demo data from the top navigation.'}
          </p>
          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsProjectModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddSite={handleAddSite}
            />
          ))}
        </div>
      )}

      {/* Project Creation / Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      {/* Site Creation Modal */}
      <SiteCreateModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        defaultProjectId={selectedProjectIdForSite}
      />
    </div>
  );
};
