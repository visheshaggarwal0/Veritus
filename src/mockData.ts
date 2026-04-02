import { User, Role, Task } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u0', name: 'System Admin', email: 'admin@veritus.com', role: Role.IT_ADMIN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  { id: 'u1', name: 'Alexander Weber', email: 'ceo@veritus.com', role: Role.CEO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'u2', name: 'Sarah Chen', email: 'coo@veritus.com', role: Role.COO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'u3', name: 'James Miller', email: 'cso@veritus.com', role: Role.CSO, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'u4', name: 'Elena Rodriguez', email: 'dept.head@veritus.com', role: Role.DEPARTMENT_HEAD, departmentId: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  { id: 'u5', name: 'James Wilson', email: 'senior@veritus.com', role: Role.SENIOR_ASSOCIATE, departmentId: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'u6', name: 'Lily Zhang', email: 'junior@veritus.com', role: Role.JUNIOR_ASSOCIATE, departmentId: 'Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily' },
  { id: 'u7', name: 'Robert Fox', email: 'mkt.head@veritus.com', role: Role.DEPARTMENT_HEAD, departmentId: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Quarterly Strategy Review',
    description: 'Review the Q2 performance and set targets for Q3.',
    assignedBy: 'u1',
    assignedTo: 'u2',
    status: 'in_progress',
    priority: 'high',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Engineering Budgeting',
    description: 'Finalize the budget for the Engineering department.',
    assignedBy: 'u2',
    assignedTo: 'u4',
    status: 'pending',
    priority: 'medium',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Core Infrastructure Upgrade',
    description: 'Upgrade the main server clusters to the latest version.',
    assignedBy: 'u4',
    assignedTo: 'u5',
    status: 'completed',
    priority: 'high',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
