import { api } from './api';
import { Project } from '../types';
import { MockDataStore } from './mockDataStore';

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving projects from local demo store:', err?.message);
      return MockDataStore.getProjects();
    }
  },

  async getProject(id: string): Promise<Project & { sites: any[] }> {
    try {
      const response = await api.get<Project & { sites: any[] }>(`/projects/${id}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving project detail from local demo store:', err?.message);
      return MockDataStore.getProject(id);
    }
  },

  async createProject(data: CreateProjectInput): Promise<Project> {
    try {
      const response = await api.post<Project>('/projects', data);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, creating project in local demo store:', err?.message);
      return MockDataStore.createProject(data);
    }
  },

  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    try {
      const response = await api.put<Project>(`/projects/${id}`, data);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, updating project in local demo store:', err?.message);
      return MockDataStore.updateProject(id, data);
    }
  },

  async deleteProject(id: string): Promise<{ message: string; id: string }> {
    try {
      const response = await api.delete<{ message: string; id: string }>(`/projects/${id}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, deleting project in local demo store:', err?.message);
      return MockDataStore.deleteProject(id);
    }
  },
};
