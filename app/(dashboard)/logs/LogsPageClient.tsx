"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  ShieldCheck, 
  Terminal, 
  Search, 
  Filter, 
  Activity, 
  CheckCircle2, 
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/types";

interface LogEntry {
  id: string;
  user_id: string;
  message: string;
  type: string;
  created_at: string;
  profiles: {
    name: string;
    role: string;
  };
}

export default function LogsPageClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from("notifications")
        .select(`
          *,
          profiles:user_id (
            name,
            role
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setLogs(data as unknown as LogEntry[]);
      setLoading(false);
    }
    fetchLogs();

    // Real-time subscription for live logs
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          // Fetch the user data for the new notification
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("name, role")
            .eq("id", payload.new.user_id)
            .single();

          const newLog = {
            ...payload.new,
            profiles: userProfile
          } as LogEntry;

          setLogs((prev) => [newLog, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-in fade-in duration-500">
        <div className="w-10 h-10 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 font-semibold text-xs uppercase tracking-widest">Decrypting Audit Trail...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-display">Security Feed</h1>
            <Badge variant="reviewed">Live Node</Badge>
          </div>
          <p className="text-zinc-400 font-medium text-sm">Review hierarchical activity and system-wide operational logs.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm w-[300px] focus-within:border-zinc-300 transition-all">
             <Search size={16} className="text-zinc-300" />
             <input 
               type="text" 
               placeholder="Filter security events..." 
               className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
             />
           </div>
           <button className="p-2.5 bg-zinc-900 text-white rounded-xl shadow-md hover:bg-zinc-800 transition-all active:scale-95">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 font-display">System Integrity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">RLS Encryption</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sync Latency</span>
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md">8ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Node Status</span>
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md">Healthy</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-100">
               <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-xl border border-zinc-100 border-dashed group cursor-help">
                 <Terminal size={32} className="text-zinc-200 mb-4 group-hover:scale-110 group-hover:text-zinc-900 transition-all" />
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Root Command Protocol Authorized</p>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Event Identity</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Operational Activity</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Timestamp</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/30 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                            log.type === 'assignment' ? "bg-zinc-900 text-white" : "bg-white border border-zinc-100 text-zinc-400"
                          )}>
                             {log.type === 'assignment' ? <Activity size={14} /> : <CheckCircle2 size={14} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-900 leading-tight mb-0.5 font-display">{log.profiles?.name || 'Authorized Node'}</div>
                            <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{log.profiles?.role || 'SYSTEM ROOT'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-[11px] font-semibold text-zinc-500 max-w-sm">{log.message}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                          <Clock size={12} className="stroke-2" />
                          {new Date(log.created_at).toLocaleTimeString()} — {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:border-zinc-100 hover:shadow-sm rounded-lg transition-all border border-transparent">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <ShieldCheck size={48} className="text-zinc-100 mb-4" />
                          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest italic">No operational logs archived in current session.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
