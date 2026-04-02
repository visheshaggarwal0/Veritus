"use client";

import { useState } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { User } from "@/lib/types";
import { NewTaskModal } from "./NewTaskModal";

interface DashboardHeaderProps {
  currentUser: User;
}

export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-24 border-b border-zinc-100 bg-white/70 backdrop-blur-3xl px-12 flex items-center justify-between shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-6 bg-zinc-50/50 px-6 py-3 rounded-2xl border border-zinc-100 w-[500px] transition-all focus-within:w-[600px] focus-within:border-zinc-900 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-zinc-200">
          <Search size={18} className="text-zinc-400 stroke-3" />
          <input 
            type="text" 
            placeholder="Search tasks, members, or projects..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full font-bold placeholder:text-zinc-300"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group active:scale-95 shadow-sm border border-zinc-50 bg-white">
            <Bell size={22} className="group-hover:rotate-12 transition-transform stroke-2" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-zinc-950 rounded-full border-2 border-white" />
          </button>
          <div className="h-8 w-px bg-zinc-100 mx-2" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 bg-zinc-900 text-white text-xs font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95 tracking-widest uppercase"
          >
            <Plus size={18} className="stroke-3" />
            <span>NEW TASK</span>
          </button>
        </div>
      </header>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={currentUser} 
      />
    </>
  );
}
