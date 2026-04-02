import { createClient } from "@/lib/supabase/server";
import { 
  Plus, 
  Settings, 
  Building2, 
  UserCircle,
  ShieldCheck,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from "@/components/Badge";
import { Role, User, ROLE_LEVELS } from "@/lib/types";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const currentUser = profile as User;
  const isITAdmin = currentUser.role_level === 0;

  // Fetch all profiles
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("role_level", { ascending: true });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-2">Personnel Directory</h1>
          <p className="text-zinc-500 font-medium text-sm italic">Organizational hierarchy and access level management.</p>
        </div>
        {isITAdmin && (
          <button className="flex items-center gap-2 px-6 py-4 bg-zinc-900 text-white text-xs font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95 uppercase tracking-widest">
            <Plus size={18} className="stroke-[3]" />
            Provision New Account
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm shrink-0">
        <div className="flex items-center gap-3 bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100 flex-1">
          <Search size={18} className="text-zinc-400 stroke-[3]" />
          <input 
            type="text" 
            placeholder="Filter by rank, department, or identity..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full font-bold placeholder:text-zinc-300"
          />
        </div>
        <div className="h-10 w-px bg-zinc-100 mx-2" />
        <div className="flex items-center gap-2">
          {['All Ranks', 'Executives', 'Operations', 'Associates'].map(filter => (
            <button key={filter} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-100">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50/30 border-b border-zinc-100">
                <th className="px-10 py-8 text-[11px] font-black text-zinc-300 uppercase tracking-[0.25em]">Strategic Identity</th>
                <th className="px-10 py-8 text-[11px] font-black text-zinc-300 uppercase tracking-[0.25em]">Organizational Rank</th>
                <th className="px-10 py-8 text-[11px] font-black text-zinc-300 uppercase tracking-[0.25em]">Operational Unit</th>
                <th className="px-10 py-8 text-[11px] font-black text-zinc-300 uppercase tracking-[0.25em] text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {(allUsers || []).map((user: User) => (
                <tr key={user.id} className="hover:bg-zinc-50/20 transition-all group">
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-6">
                      <div className="relative group/avatar">
                        <img 
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl group-hover/avatar:scale-110 transition-transform duration-500" 
                          alt="" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-zinc-50 shadow-md">
                          <div className={cn("w-2 h-2 rounded-full", user.role_level === 0 ? "bg-zinc-900" : "bg-emerald-400")} />
                        </div>
                      </div>
                      <div>
                        <div className="text-base font-black text-zinc-900 leading-tight group-hover:text-zinc-600 transition-colors uppercase italic tracking-tighter">{user.name}</div>
                        <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role_level === 0 ? 'reviewed' : 'default'}>{user.role}</Badge>
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic shrink-0">Level {user.role_level}</span>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-3 text-[11px] text-zinc-900 font-black uppercase tracking-widest">
                      <Building2 size={16} className="text-zinc-200 stroke-[3]" />
                      {user.department_id || 'Global Operational Node'}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="p-3 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:shadow-xl rounded-2xl transition-all active:scale-90 border border-transparent hover:border-zinc-100">
                        <UserCircle size={22} className="stroke-[2.5]" />
                      </button>
                      {isITAdmin && (
                        <button className="p-3 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:shadow-xl rounded-2xl transition-all active:scale-90 border border-transparent hover:border-zinc-100">
                          <Settings size={22} className="stroke-[2.5]" />
                        </button>
                      )}
                      <button className="p-3 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:shadow-xl rounded-2xl transition-all active:scale-90 border border-transparent hover:border-zinc-100">
                        <MoreHorizontal size={22} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isITAdmin && (
        <div className="p-10 bg-zinc-900 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl shadow-zinc-200">
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-2xl">
              <h4 className="text-xl font-black mb-3 italic uppercase tracking-tight">Security Infrastructure Advanced Console</h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed tracking-wide">
                Direct write-access to the hierarchical permission matrix is enabled for your executive node. 
                All modifications to user profiles and access levels are cryptographically logged in the system audit trail.
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-transform shadow-xl">
              Open Audit Console
            </button>
          </div>
          <ShieldCheck size={200} className="absolute -bottom-20 -right-20 text-white/[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 stroke-[1.5]" />
        </div>
      )}
    </div>
  );
}

// Internal cn utility
import { cn } from "@/lib/types";
