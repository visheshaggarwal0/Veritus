import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Settings,
  Building2,
  UserCircle,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from "@/components/Badge";
import { User, cn } from "@/lib/types";
import { UsersPageClient } from "./UsersPageClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", authUser.email)
    .single();

  const isITAdmin = profile?.role_level === 0 || authUser.user_metadata?.role_level === 0;
  
  if (!isITAdmin) {
    redirect("/dashboard");
  }

  // Fetch all profiles
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("role_level", { ascending: true });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <UsersPageClient isITAdmin={isITAdmin} />

      <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-zinc-100 shadow-sm shrink-0">
        <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2.5 rounded-lg border border-zinc-100 flex-1 focus-within:border-zinc-300 transition-all">
          <Search size={16} className="text-zinc-400 stroke-2" />
          <input
            type="text"
            placeholder="Filter by rank, department, or identity..."
            className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
          />
        </div>
        <div className="h-8 w-px bg-zinc-100 mx-1" />
        <div className="flex items-center gap-1.5">
          {['All Ranks', 'Executives', 'Operations'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all leading-none">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Strategic Identity</th>
                <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Organizational Rank</th>
                <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Operational Unit</th>
                <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {(allUsers || []).map((user: User) => (
                <tr key={user.id} className="hover:bg-zinc-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-100 shadow-sm transition-transform duration-500 group-hover:scale-105"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-zinc-50 shadow-sm">
                          <div className={cn("w-1.5 h-1.5 rounded-full", user.role_level === 0 ? "bg-zinc-900" : "bg-emerald-400")} />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 leading-tight mb-0.5 font-display">{user.name}</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Badge variant={user.role_level === 0 ? 'reviewed' : 'default'}>{user.role}</Badge>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider leading-none">Level {user.role_level}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                      <Building2 size={14} className="text-zinc-300 stroke-2" />
                      {user.department_id || 'Global Operational Node'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:border-zinc-100 hover:shadow-sm rounded-lg transition-all border border-transparent">
                        <UserCircle size={18} className="stroke-2" />
                      </button>
                      {isITAdmin && (
                        <button className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:border-zinc-100 hover:shadow-sm rounded-lg transition-all border border-transparent">
                          <Settings size={18} className="stroke-2" />
                        </button>
                      )}
                      <button className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:border-zinc-100 hover:shadow-sm rounded-lg transition-all border border-transparent">
                        <MoreHorizontal size={18} className="stroke-2" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
