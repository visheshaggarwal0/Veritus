"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Tag,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isToday
} from "date-fns";
import { Task, cn } from "@/lib/types";
import { Badge } from "@/components/Badge";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("deadline", { ascending: true });

      if (data) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, [supabase]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 mb-2">Temporal Strategy</h1>
          <p className="text-zinc-500 font-medium text-sm italic">Strategic deadline distribution and project timelines.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-zinc-100 shadow-sm">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900"
            >
              <ChevronLeft size={20} className="stroke-3" />
            </button>
            <div className="px-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 min-w-[180px] text-center italic">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900"
            >
              <ChevronRight size={20} className="stroke-3" />
            </button>
          </div>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-6 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95"
          >
            Today
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-4 border-b border-zinc-100 pb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] font-sans">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayTasks = tasks.filter((t) => isSameDay(new Date(t.deadline), currentDay));

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[160px] p-4 bg-white border border-zinc-50 rounded-[2.5rem] transition-all hover:border-zinc-300 group shadow-sm flex flex-col relative overflow-hidden",
              !isSameMonth(day, monthStart) && "opacity-20 pointer-events-none",
              isToday(day) && "ring-4 ring-zinc-900/5 bg-zinc-50/20"
            )}
          >
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className={cn(
                "text-xs font-black px-3 py-1 rounded-xl transition-all",
                isToday(day) ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-300 group-hover:text-zinc-900"
              )}>
                {format(day, "d")}
              </span>
              {dayTasks.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 blur-[0.5px]" />
              )}
            </div>

            <div className="space-y-2 relative z-10 flex-1">
              {dayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight truncate border transition-all cursor-pointer hover:scale-105",
                    task.priority === 'high' ? "bg-zinc-900 text-white border-zinc-900 shadow-xl" : "bg-white text-zinc-900 border-zinc-100"
                  )}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-[9px] font-black text-zinc-400 text-center uppercase tracking-widest pt-1">
                  + {dayTasks.length - 3} more directives
                </div>
              )}
            </div>

            <div className="absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-10 transition-opacity">
              <CalendarIcon size={80} className="text-zinc-900 stroke-[1.5]" />
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-6 mb-6">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000">
      {renderHeader()}
      <div className="p-10 bg-white border border-zinc-100 rounded-[4rem] shadow-2xl shadow-zinc-100 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <CalendarIcon size={400} className="text-zinc-900 stroke-1" />
        </div>

        {renderDays()}
        <div className="flex-1 overflow-y-auto pr-4 pt-4 scrollbar-hide">
          {renderCells()}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-900" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Critical Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 border border-zinc-200 rounded-full bg-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Regular Directives</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-zinc-500 italic uppercase tracking-widest">
            Synchronized with <span className="text-zinc-900">Enterprise Time Services</span>
          </p>
        </div>
      </div>
    </div>
  );
}
