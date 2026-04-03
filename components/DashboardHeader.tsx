"use client";

import { useState } from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { User } from "@/lib/types";
import { NewTaskModal } from "./NewTaskModal";

interface DashboardHeaderProps {
  currentUser: User;
  onMenuClick?: () => void;
}

export function DashboardHeader({ currentUser, onMenuClick }: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-20 border-b border-zinc-100 bg-white/70 backdrop-blur-3xl px-4 md:px-10 flex items-center justify-between shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-50 rounded-xl border border-zinc-100"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="hidden sm:flex items-center gap-4 bg-zinc-50 px-5 py-2.5 rounded-xl border border-zinc-100 w-[300px] lg:w-[450px] transition-all focus-within:lg:w-[500px] focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-sm">
            <Search size={18} className="text-zinc-400 stroke-2" />
            <input 
              type="text" 
              placeholder="Search tasks, members, or projects..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium placeholder:text-zinc-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all group active:scale-95 border border-transparent hover:border-zinc-100 bg-white">
            <Bell size={20} className="group-hover:rotate-12 transition-transform stroke-2" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-zinc-950 rounded-full border-2 border-white" />
          </button>
          <div className="h-6 w-px bg-zinc-100 mx-1" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md active:scale-95"
          >
            <Plus size={16} className="stroke-2" />
            <span>New Task</span>
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
