import axios from 'axios';
import type { User, Project, Task } from '../types';
import { TaskStatus, Priority } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: User) => api.post<User>('/users', user),
  update: (id: number, user: User) => api.put<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Project API
export const projectApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  getByUserId: (userId: number) => api.get<Project[]>(`/projects/user/${userId}`),
  create: (project: Project) => api.post<Project>('/projects', project),
  update: (id: number, project: Project) => api.put<Project>(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Task API
export const taskApi = {
  getAll: (status?: TaskStatus, priority?: Priority) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    return api.get<Task[]>('/tasks', { params });
  },
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  getByUserId: (userId: number) => api.get<Task[]>(`/tasks/user/${userId}`),
  getByProjectId: (projectId: number) => api.get<Task[]>(`/tasks/project/${projectId}`),
  create: (task: Task) => api.post<Task>('/tasks', task),
  update: (id: number, task: Task) => api.put<Task>(`/tasks/${id}`, task),
  updateStatus: (id: number, status: TaskStatus) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;