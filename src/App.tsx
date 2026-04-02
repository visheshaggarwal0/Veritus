import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  Bell, 
  LogOut, 
  Plus, 
  Search, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  User as UserIcon,
  MessageSquare,
  Filter,
  Users as UsersIcon,
  Settings,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useVeritusStore } from './store';
import { Role, Task, TaskStatus, Priority, User, ROLE_LEVELS } from './types';
import { cn } from './types';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      active 
        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
    )}
  >
    <Icon size={18} className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span>{label}</span>
  </button>
);

const Badge = ({ children, variant = 'default' }: any) => {
  const variants: any = {
    default: "bg-zinc-100 text-zinc-600",
    high: "bg-zinc-900 text-white",
    medium: "bg-zinc-200 text-zinc-800",
    low: "bg-zinc-50 text-zinc-400 border border-zinc-100",
    pending: "bg-zinc-100 text-zinc-500",
    in_progress: "bg-zinc-900 text-white",
    completed: "bg-zinc-200 text-zinc-800",
    reviewed: "bg-zinc-100 text-zinc-900 font-bold border border-zinc-900",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

// --- Views ---

const Dashboard = ({ store }: { store: any }) => {
  const { tasks, currentUser, onTaskClick } = store;
  
  const isHighLevel = currentUser.role === Role.IT_ADMIN || ROLE_LEVELS[currentUser.role] >= 5;

  const assignedToMe = tasks.filter((t: Task) => t.assignedTo === currentUser?.id);
  const assignedByMe = tasks.filter((t: Task) => t.assignedBy === currentUser?.id);
  const overdue = tasks.filter((t: Task) => new Date(t.deadline) < new Date() && t.status !== 'reviewed');

  const stats = [
    { 
      label: isHighLevel ? 'Total Tasks' : 'Assigned to Me', 
      value: isHighLevel ? tasks.length : assignedToMe.length, 
      icon: UserIcon 
    },
    { 
      label: isHighLevel ? 'Active Projects' : 'Assigned by Me', 
      value: isHighLevel ? tasks.filter((t: Task) => t.status !== 'reviewed').length : assignedByMe.length, 
      icon: ChevronRight 
    },
    { label: 'Overdue Tasks', value: overdue.length, icon: AlertCircle, color: 'text-zinc-900' },
    { 
      label: currentUser.departmentId ? `${currentUser.departmentId} Tasks` : 'Global Visibility', 
      value: tasks.length, 
      icon: LayoutDashboard 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <stat.icon size={20} className="text-zinc-900" />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Recent Assignments</h3>
          <div className="space-y-3">
            {assignedToMe.slice(0, 5).map((task: Task) => (
              <div 
                key={task.id} 
                onClick={() => onTaskClick(task)}
                className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl hover:border-zinc-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-1 h-8 rounded-full", task.priority === 'high' ? "bg-zinc-900" : "bg-zinc-200")} />
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{task.title}</div>
                    <div className="text-xs text-zinc-500">Due {new Date(task.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
                <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Team Activity</h3>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 min-h-[300px] flex flex-col items-center justify-center text-center">
            <MessageSquare size={48} className="mb-4 text-zinc-200" />
            <p className="text-zinc-500 text-sm">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ store }: { store: any }) => {
  const { tasks, updateTask, onTaskClick } = store;
  const columns: TaskStatus[] = ['pending', 'in_progress', 'completed', 'reviewed'];

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-12rem)]">
      {columns.map((status) => (
        <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              {status.replace('_', ' ')}
              <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">
                {tasks.filter((t: Task) => t.status === status).length}
              </span>
            </h3>
          </div>
          
          <div className="flex-1 p-2 bg-zinc-50/50 rounded-2xl border border-zinc-100 space-y-3 overflow-y-auto">
            {tasks.filter((t: Task) => t.status === status).map((task: Task) => (
              <motion.div
                layoutId={task.id}
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="p-4 bg-white border border-zinc-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={task.priority}>{task.priority}</Badge>
                  <button className="text-zinc-400 hover:text-zinc-900">
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="text-sm font-bold text-zinc-900 mb-1">{task.title}</div>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{task.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold">
                      {task.assignedTo.charAt(0)}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium">Due {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const UserManagement = ({ store }: { store: any }) => {
  const { allUsers } = store;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">System Users</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all">
          <Plus size={14} />
          Add User
        </button>
      </div>
      
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Role & Level</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Department</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {allUsers.map((user: User) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-lg border border-zinc-200" alt="" />
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{user.name}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{user.role}</Badge>
                    <span className="text-[10px] font-black text-zinc-300">Lvl {ROLE_LEVELS[user.role]}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                    <Building2 size={14} className="text-zinc-400" />
                    {user.departmentId || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Settings size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const store = useVeritusStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as Priority,
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleCreateTask = () => {
    if (!newTaskData.title || !newTaskData.assignedTo) return;
    store.addTask({
      ...newTaskData,
      status: 'pending',
      deadline: new Date(newTaskData.deadline).toISOString()
    });
    setIsNewTaskModalOpen(false);
    setNewTaskData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      deadline: new Date().toISOString().split('T')[0]
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    store.updateTask(taskId, { status: newStatus });
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  if (!store.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl shadow-zinc-200"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-zinc-200">
              <span className="text-white text-2xl font-black italic">V</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">VERITUS</h1>
            <p className="text-zinc-500 text-sm">Hierarchical CRM System</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@veritus.com"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => store.login(email)}
              className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-[0.98]"
            >
              Sign In
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-3 text-center">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {['admin@veritus.com', 'ceo@veritus.com', 'coo@veritus.com', 'dept.head@veritus.com', 'senior@veritus.com', 'junior@veritus.com'].map(demo => (
                <button
                  key={demo}
                  onClick={() => setEmail(demo)}
                  className="px-3 py-2 text-[10px] font-bold text-zinc-500 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors border border-zinc-100"
                >
                  {demo.split('@')[0]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-black italic">V</span>
          </div>
          <span className="text-lg font-black tracking-tighter">VERITUS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Kanban} 
            label="Kanban" 
            active={activeTab === 'kanban'} 
            onClick={() => setActiveTab('kanban')} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Calendar" 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
          />
          
          {store.currentUser.role === Role.IT_ADMIN && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Administration</div>
              <SidebarItem 
                icon={UsersIcon} 
                label="Users" 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
              />
              <SidebarItem 
                icon={ShieldCheck} 
                label="System Logs" 
                active={activeTab === 'logs'} 
                onClick={() => setActiveTab('logs')} 
              />
            </>
          )}

          {store.currentUser.role !== Role.IT_ADMIN && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Management</div>
              <SidebarItem 
                icon={Plus} 
                label="New Task" 
                onClick={() => setIsNewTaskModalOpen(true)} 
              />
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img src={store.currentUser.avatar} className="w-10 h-10 rounded-xl border border-zinc-200" alt="Avatar" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{store.currentUser.name}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{store.currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={store.logout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-zinc-50/30">
        <header className="h-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 w-96">
            <Search size={18} className="text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search tasks, members..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
              <Bell size={20} />
              {store.notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-zinc-900 rounded-full border-2 border-white" />
              )}
            </button>
            <div className="h-8 w-[1px] bg-zinc-100 mx-2" />
            <button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              <Plus size={18} />
              <span>New Task</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h2>
                  <p className="text-zinc-500 text-sm">Manage your organization's workflow and performance.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white border border-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 shadow-sm">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              {activeTab === 'dashboard' && <Dashboard store={{ ...store, onTaskClick: setSelectedTask }} />}
              {activeTab === 'kanban' && <KanbanBoard store={{ ...store, onTaskClick: setSelectedTask }} />}
              {activeTab === 'users' && store.currentUser.role === Role.IT_ADMIN && <UserManagement store={store} />}
              {activeTab === 'logs' && store.currentUser.role === Role.IT_ADMIN && (
                <div className="p-12 bg-white border border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-center">
                  <ShieldCheck size={64} className="text-zinc-100 mb-4" />
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">System Logs</h3>
                  <p className="text-zinc-500 max-w-xs">Audit trails and system events are being recorded securely.</p>
                </div>
              )}
              {activeTab === 'calendar' && (
                <div className="grid grid-cols-7 gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest py-4">{day}</div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dayTasks = store.tasks.filter(t => new Date(t.deadline).toDateString() === date.toDateString());
                    return (
                      <div key={i} className={cn(
                        "min-h-[120px] p-3 bg-white border border-zinc-100 rounded-2xl transition-all hover:border-zinc-300",
                        date.getMonth() !== new Date().getMonth() && "opacity-30"
                      )}>
                        <div className="text-xs font-bold text-zinc-400 mb-2">{date.getDate()}</div>
                        <div className="space-y-1">
                          {dayTasks.map(t => (
                            <div key={t.id} className="text-[10px] font-bold p-1 bg-zinc-900 text-white rounded truncate">
                              {t.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xl h-full bg-white shadow-2xl p-10 overflow-y-auto border-l border-zinc-100"
            >
              <div className="flex items-center justify-between mb-8">
                <Badge variant={selectedTask.priority}>{selectedTask.priority} Priority</Badge>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <h2 className="text-3xl font-black mb-2 tracking-tight">{selectedTask.title}</h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">{selectedTask.description}</p>

              <div className="grid grid-cols-2 gap-8 mb-10 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'in_progress', 'completed', 'reviewed'] as TaskStatus[]).map(s => (
                      <button 
                        key={s}
                        onClick={() => handleStatusChange(selectedTask.id, s)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                          selectedTask.status === s 
                            ? "bg-zinc-900 text-white border-zinc-900 shadow-md" 
                            : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900"
                        )}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Deadline</div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(selectedTask.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare size={18} />
                  Comments
                </h3>
                <div className="space-y-4">
                  {store.comments.filter(c => c.taskId === selectedTask.id).map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        {store.allUsers.find(u => u.id === comment.userId)?.name.charAt(0)}
                      </div>
                      <div className="flex-1 p-4 bg-zinc-50 rounded-2xl text-sm">
                        <div className="font-bold mb-1">{store.allUsers.find(u => u.id === comment.userId)?.name}</div>
                        <p className="text-zinc-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        store.addComment(selectedTask.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-zinc-100"
          >
            <h3 className="text-xl font-black mb-6">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                  placeholder="e.g. Q3 Sales Strategy" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea 
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 min-h-[100px]" 
                  placeholder="Detailed task breakdown..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Assign To</label>
                  <select 
                    value={newTaskData.assignedTo}
                    onChange={(e) => setNewTaskData({...newTaskData, assignedTo: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="">Select Member</option>
                    {store.getSubordinates().map((u: User) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Priority</label>
                  <select 
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value as Priority})}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Deadline</label>
                <input 
                  type="date" 
                  value={newTaskData.deadline}
                  onChange={(e) => setNewTaskData({...newTaskData, deadline: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsNewTaskModalOpen(false)} className="flex-1 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition-all">Cancel</button>
                <button 
                  onClick={handleCreateTask}
                  className="flex-1 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                  Create Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
