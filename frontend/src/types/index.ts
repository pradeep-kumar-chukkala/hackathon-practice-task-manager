export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export interface User {
  id?: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Project {
  id?: number;
  name: string;
  description?: string;
  createdBy?: User;
  createdAt?: string;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo?: User;
  project?: Project;
  dueDate?: string;
  createdAt?: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}