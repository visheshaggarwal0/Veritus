"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  LogOut, 
  Plus, 
  Users as UsersIcon,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { Role, User } from '@/lib/types';
import { SidebarItem } from './SidebarItem';
import { createClient } from '@/lib/supabase/client';

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-72 border-r border-zinc-100 p-8 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto bg-white">
      <div className="flex items-center gap-3 mb-12 px-2 shrink-0">
        <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center rotate-3 shadow-xl shadow-zinc-200">
          <span className="text-white text-lg font-black italic -rotate-3">V</span>
        </div>
        <span className="text-xl font-black tracking-tighter">VERITUS</span>
      </div>

      {/* User Profile Detail Section */}
      <div className="mb-10 p-6 bg-zinc-50 rounded-4xl border border-zinc-100 shrink-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img 
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl" 
              alt="Avatar" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-black truncate leading-tight text-zinc-900">{user.name}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{user.role}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-sm">
            <Settings size={12} className="stroke-3" />
            SETTINGS
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-2.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-sm"
          >
            <LogOut size={12} className="stroke-3" />
            LOGOUT
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="px-5 mb-4 text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em]">Main Workflow</div>
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={pathname === '/dashboard'} 
          onClick={() => router.push('/dashboard')} 
        />
        <SidebarItem 
          icon={Kanban} 
          label="Kanban Board" 
          active={pathname === '/kanban'} 
          onClick={() => router.push('/kanban')} 
        />
        <SidebarItem 
          icon={Calendar} 
          label="Project Calendar" 
          active={pathname === '/calendar'} 
          onClick={() => router.push('/calendar')} 
        />
        
        {user.role_level === 0 && (
          <>
            <div className="pt-10 pb-4 px-5 text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em]">Infrastructure</div>
            <SidebarItem 
              icon={UsersIcon} 
              label="User Directory" 
              active={pathname === '/users'} 
              onClick={() => router.push('/users')} 
            />
            <SidebarItem 
              icon={ShieldCheck} 
              label="System Health" 
              active={pathname === '/logs'} 
              onClick={() => router.push('/logs')} 
            />
          </>
        )}

        <div className="pt-10 pb-4 px-5 text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em]">Quick Actions</div>
        <button className="flex items-center gap-3 w-full px-5 py-4 text-xs font-black text-white bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100 group">
          <div className="p-1 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
            <Plus size={16} className="stroke-3" />
          </div>
          NEW TASK
        </button>
      </nav>
      
      <div className="mt-auto pt-8 border-t border-zinc-100">
        <div className="flex items-center gap-2 px-2 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Systems Online
        </div>
      </div>
    </aside>
  );
}
