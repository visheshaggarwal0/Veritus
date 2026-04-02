import { useState, useEffect } from 'react';
import { User, Task, Comment, Notification, Role, ROLE_LEVELS } from './types';
import { MOCK_USERS, INITIAL_TASKS } from './mockData';
import { supabase } from './lib/supabase';

const IS_SUPABASE_CONFIGURED = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useVeritusStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('veritus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (IS_SUPABASE_CONFIGURED) {
        try {
          // Fetch profiles first to map names
          const { data: profilesData } = await supabase.from('profiles').select('*');
          const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
          const { data: commentsData } = await supabase.from('comments').select('*');
          const { data: notificationsData } = await supabase.from('notifications').select('*');
          
          if (tasksData) setTasks(tasksData);
          if (commentsData) setComments(commentsData);
          if (notificationsData) setNotifications(notificationsData);
          // In a real app, we'd sync MOCK_USERS with profilesData here
        } catch (error) {
          console.error('Supabase fetch error:', error);
        }
      } else {
        const savedTasks = localStorage.getItem('veritus_tasks');
        setTasks(savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS);
        
        const savedComments = localStorage.getItem('veritus_comments');
        setComments(savedComments ? JSON.parse(savedComments) : []);
        
        const savedNotifications = localStorage.getItem('veritus_notifications');
        setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Persistence Sync (Fallback only)
  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      localStorage.setItem('veritus_tasks', JSON.stringify(tasks));
      localStorage.setItem('veritus_comments', JSON.stringify(comments));
      localStorage.setItem('veritus_notifications', JSON.stringify(notifications));
    }
  }, [tasks, comments, notifications]);

  const login = (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('veritus_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('veritus_user');
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedBy'>) => {
    if (!currentUser) return;

    const newTask: any = {
      ...taskData,
      assignedBy: currentUser.id,
      updatedAt: new Date().toISOString(),
    };

    if (IS_SUPABASE_CONFIGURED) {
      const { data, error } = await supabase.from('tasks').insert([newTask]).select();
      if (data) setTasks(prev => [data[0], ...prev]);
      
      // Notify assignee
      await supabase.from('notifications').insert([{
        user_id: taskData.assignedTo,
        message: `New task assigned: ${taskData.title}`,
        type: 'assignment',
      }]);
    } else {
      const localTask = { ...newTask, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
      setTasks(prev => [localTask, ...prev]);
      
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: taskData.assignedTo,
        message: `New task assigned: ${taskData.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'assignment',
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('tasks').update({ ...updates, updatedAt: new Date().toISOString() }).eq('id', taskId);
      if (!error) setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    } else {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    }
  };

  const deleteTask = async (taskId: string) => {
    if (IS_SUPABASE_CONFIGURED) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (!error) setTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const addComment = async (taskId: string, text: string) => {
    if (!currentUser) return;
    
    if (IS_SUPABASE_CONFIGURED) {
      const { data, error } = await supabase.from('comments').insert([{
        task_id: taskId,
        user_id: currentUser.id,
        text,
      }]).select();
      if (data) setComments(prev => [...prev, data[0]]);
    } else {
      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        taskId,
        userId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
      };
      setComments(prev => [...prev, newComment]);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (IS_SUPABASE_CONFIGURED) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Hierarchical Logic Helpers
  const isITAdmin = currentUser?.role === Role.IT_ADMIN;
  const isExecutive = currentUser && ROLE_LEVELS[currentUser.role] === 5;

  const canAssignTo = (targetUser: User) => {
    if (!currentUser || isITAdmin) return false;
    
    const hasHigherLevel = ROLE_LEVELS[currentUser.role] > ROLE_LEVELS[targetUser.role];
    const isSameDept = currentUser.departmentId === targetUser.departmentId;
    
    return hasHigherLevel && (isExecutive || isSameDept);
  };

  const getSubordinates = () => {
    if (!currentUser || isITAdmin) return [];
    return MOCK_USERS.filter(u => {
      const isLower = ROLE_LEVELS[u.role] < ROLE_LEVELS[currentUser.role];
      const isSameDept = currentUser.departmentId === u.departmentId;
      return isLower && (isExecutive || isSameDept);
    });
  };

  const visibleTasks = tasks.filter(task => {
    if (!currentUser) return false;
    if (isITAdmin || isExecutive) return true;

    const isAssignee = task.assignedTo === currentUser.id;
    const isAssigner = task.assignedBy === currentUser.id;
    
    const assignee = MOCK_USERS.find(u => u.id === task.assignedTo);
    const isSubordinateTask = assignee && 
      ROLE_LEVELS[assignee.role] < ROLE_LEVELS[currentUser.role] &&
      assignee.departmentId === currentUser.departmentId;

    return isAssignee || isAssigner || isSubordinateTask;
  });

  return {
    currentUser,
    tasks: visibleTasks,
    allUsers: MOCK_USERS,
    comments,
    notifications: notifications.filter(n => n.userId === currentUser?.id),
    isLoading,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    markNotificationRead,
    canAssignTo,
    getSubordinates,
  };
}
