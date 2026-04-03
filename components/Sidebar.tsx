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
  UserCircle
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
      <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
        <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white text-base font-bold">V</span>
        </div>
        <span className="text-lg font-bold tracking-tight">Veritus</span>
      </div>


      {/* User Profile Detail Section */}
      <div className="mb-8 p-6 bg-zinc-50/50 rounded-2xl border border-zinc-100 shrink-0">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <img 
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              className="w-12 h-12 rounded-xl border-2 border-white shadow-sm" 
              alt="Avatar" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate leading-tight text-zinc-900">{user.name}</div>
            <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">{user.role}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center justify-center gap-2 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm"
          >
            <UserCircle size={12} className="stroke-2" />
            Profile
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm"
          >
            <LogOut size={12} className="stroke-2" />
            Logout
          </button>
        </div>
      </div>


      <nav className="flex-1 space-y-1">
        <div className="px-4 mb-2 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Main Workflow</div>
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
            <div className="pt-8 pb-2 px-4 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Infrastructure</div>
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

        <div className="pt-8 pb-3 px-4 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Quick Actions</div>
        <button className="flex items-center gap-3 w-full px-4 py-3.5 text-xs font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all shadow-md group">
          <div className="p-1 bg-white/10 rounded-lg group-hover:scale-105 transition-transform">
            <Plus size={16} />
          </div>
          New Task
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
