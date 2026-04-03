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
  GUEST = 'Visitor',
}

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.IT_ADMIN]: 0,
  [Role.CEO]: 1,
  [Role.COO]: 1,
  [Role.CSO]: 1,
  [Role.COO_ASSOCIATE]: 2,
  [Role.DEPARTMENT_HEAD]: 3,
  [Role.SENIOR_ASSOCIATE]: 4,
  [Role.JUNIOR_ASSOCIATE]: 5,
  [Role.GUEST]: 5,
};

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'reviewed';
export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  role_level: number;
  department_id?: string;
  department_name?: string;
  avatar_url?: string;
  password?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_by: string; // User ID
  assigned_to: string; // User ID
  status: TaskStatus;
  priority: Priority;
  deadline: string; // ISO Date
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'assignment' | 'deadline' | 'mention';
}
