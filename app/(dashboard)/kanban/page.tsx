"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronRight,
  Clock,
  Filter,
  SortAsc,
  MoreVertical
} from 'lucide-react';
import { Badge } from "@/components/Badge";
import { Task, TaskStatus, cn } from "@/lib/types";

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const columns: TaskStatus[] = ['pending', 'in_progress', 'completed', 'reviewed'];

  useEffect(() => {
    async function fetchTasks() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setTasks(data);
      setLoading(false);
    }
    fetchTasks();

    // Subscribe to task changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) console.error("Update error:", error);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-2">Project Execution</h1>
          <p className="text-zinc-500 font-medium text-sm italic">Strategic task distribution across operational status.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-zinc-100 shadow-sm">
            <button className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md">Board View</button>
            <button className="px-4 py-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-zinc-900 transition-all">List View</button>
          </div>
          <div className="h-8 w-px bg-zinc-200 mx-1" />
          <button className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 shadow-sm transition-all active:scale-95">
            <Filter size={18} className="stroke-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
        {columns.map((status) => (
          <div key={status} className="shrink-0 w-[400px] flex flex-col bg-zinc-50/50 rounded-[3rem] border border-zinc-100/50 relative group">
            {/* Column Header */}
            <div className="p-8 pb-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full shadow-sm",
                  status === 'pending' ? "bg-zinc-300" :
                    status === 'in_progress' ? "bg-zinc-900 shadow-zinc-200" :
                      status === 'completed' ? "bg-zinc-500" : "bg-zinc-950 ring-4 ring-white"
                )} />
                <h3 className="text-[12px] font-black text-zinc-900 uppercase tracking-[0.2em]">
                  {status.replace('_', ' ')}
                </h3>
              </div>
              <span className="text-[10px] bg-white px-3 py-1.5 rounded-xl border border-zinc-100 text-zinc-950 font-black shadow-sm tracking-widest italic uppercase">
                {tasks.filter((t: Task) => t.status === status).length} DIRECTIVES
              </span>
            </div>

            {/* Card Area */}
            <div className="flex-1 px-4 pb-8 space-y-4 overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all">
              <AnimatePresence mode="popLayout">
                {tasks.filter((t: Task) => t.status === status).map((task: Task) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={task.id}
                    className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1 transition-all cursor-pointer group/card relative"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <Badge variant={task.priority}>{task.priority}</Badge>
                      <button className="p-2 opacity-0 group-hover/card:opacity-100 transition-opacity text-zinc-300 hover:text-zinc-900 rounded-xl hover:bg-zinc-50">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="text-lg font-black text-zinc-900 mb-2 leading-tight group-hover/card:text-zinc-600 transition-colors uppercase tracking-tight italic">
                      {task.title}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-6 leading-relaxed font-medium">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border-2 border-white flex items-center justify-center text-xs font-black text-white italic rotate-3 shadow-md">
                          {task.assigned_to.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} className="stroke-3" />
                          {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Workflow Navigation */}
                      <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">
                        {status !== 'reviewed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = columns[columns.indexOf(status) + 1];
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className="p-2 bg-zinc-900 text-white rounded-xl shadow-lg active:scale-90"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button className="w-full py-10 border-2 border-dashed border-zinc-100 rounded-[2.5rem] text-zinc-300 hover:text-zinc-900 hover:border-zinc-900 hover:bg-white transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98]">
                <Plus size={16} className="stroke-3" />
                Initialize Directive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
