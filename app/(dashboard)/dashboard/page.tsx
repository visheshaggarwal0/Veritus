import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  ChevronRight, 
  AlertCircle, 
  LayoutDashboard,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from "@/components/Badge";
import { Role, ROLE_LEVELS, Task, User } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Parallel fetch for stats and data
  const [
    { data: profile },
    { data: tasks },
    { data: overdueTasks }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").lt("deadline", new Date().toISOString()).neq("status", "reviewed")
  ]);

  const currentUser = profile as User;
  const isHighLevel = currentUser.role === Role.IT_ADMIN || ROLE_LEVELS[currentUser.role] <= 1;

  const assignedToMe = (tasks || []).filter((t: Task) => t.assigned_to === user.id);
  const assignedByMe = (tasks || []).filter((t: Task) => t.assigned_by === user.id);

  const stats = [
    { 
      label: isHighLevel ? 'Enterprise Tasks' : 'My Directives', 
      value: isHighLevel ? (tasks?.length || 0) : assignedToMe.length, 
      icon: Users,
      trend: "+12%"
    },
    { 
      label: isHighLevel ? 'Active Initiatives' : 'Delegated Tasks', 
      value: isHighLevel ? (tasks?.filter((t: Task) => t.status !== 'reviewed').length || 0) : assignedByMe.length, 
      icon: ChevronRight,
      trend: "+5%"
    },
    { 
      label: 'Security Alerts', 
      value: overdueTasks?.length || 0, 
      icon: AlertCircle, 
      trend: "-2%",
      red: (overdueTasks?.length || 0) > 0
    },
    { 
      label: 'Departmental Scope', 
      value: (tasks?.length || 0), 
      icon: LayoutDashboard,
      trend: "Stable"
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-2">Workspace Overview</h1>
          <p className="text-zinc-500 font-medium text-sm">Strategic analytics for <span className="font-bold text-zinc-900">{currentUser.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Live Sync: Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-zinc-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-zinc-50 rounded-2xl group-hover:scale-110 transition-transform">
                <stat.icon size={22} className="text-zinc-900 strike-[3]" />
              </div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.red ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500 uppercase tracking-widest'}`}>
                {stat.trend}
              </div>
            </div>
            <div className="text-4xl font-black text-zinc-900 tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-zinc-900 tracking-tight">Direct Assignments</h3>
            <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors flex items-center gap-1 group">
              View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {assignedToMe.length > 0 ? assignedToMe.slice(0, 4).map((task: Task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-300 transition-all hover:translate-x-2 cursor-pointer shadow-sm group"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl ${task.priority === 'high' ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-400"}`}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-zinc-900 leading-tight mb-1">{task.title}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Expires {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
              </div>
            )) : (
              <div className="p-12 bg-zinc-50/50 border-2 border-dashed border-zinc-200 rounded-[3rem] text-center text-zinc-400 text-sm font-bold flex flex-col items-center">
                <LayoutDashboard size={48} className="mb-4 opacity-20" />
                No active directives found.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6 flex flex-col">
          <h3 className="text-xl font-black text-zinc-900 tracking-tight px-2">Operational Analytics</h3>
          <div className="flex-1 min-h-[400px] p-12 bg-white border border-zinc-100 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-transparent to-zinc-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <ArrowUpRight size={32} className="text-zinc-200 stroke-3" />
              </div>
              <p className="text-zinc-900 text-lg font-black tracking-tight mb-2">Predictive Performance</p>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">Module Initialization Pending</p>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 px-8">
              <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-zinc-900 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
