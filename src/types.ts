import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Role Hierarchy Definition
 * Higher level number = Higher authority
 */
export enum Role {
  IT_ADMIN = 'IT Administrator',
  CEO = 'CEO',
  COO = 'COO',
  CSO = 'CSO',
  COO_ASSOCIATE = 'COO Associate',
  DEPARTMENT_HEAD = 'Department Head',
  SENIOR_ASSOCIATE = 'Senior Associate',
  JUNIOR_ASSOCIATE = 'Junior Associate',
}

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.IT_ADMIN]: 99,
  [Role.CEO]: 5,
  [Role.COO]: 5,
  [Role.CSO]: 5,
  [Role.COO_ASSOCIATE]: 4,
  [Role.DEPARTMENT_HEAD]: 3,
  [Role.SENIOR_ASSOCIATE]: 2,
  [Role.JUNIOR_ASSOCIATE]: 1,
};

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'reviewed';
export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string; // User ID
  assignedTo: string; // User ID
  status: TaskStatus;
  priority: Priority;
  deadline: string; // ISO Date
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'assignment' | 'deadline' | 'mention';
}
