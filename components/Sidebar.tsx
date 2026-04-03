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
  TrendingUp,
  UserCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Role, User, cn } from '@/lib/types';
import { SidebarItem } from './SidebarItem';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ user, isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const sidebarContent = (
    <div className={cn(
      "border-r border-zinc-100 flex flex-col shrink-0 h-full bg-white relative transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Desktop Collapse Toggle */}
      <button 
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-zinc-200 rounded-full items-center justify-center text-zinc-400 hover:text-zinc-900 shadow-sm z-50 transition-all hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn("p-5 flex flex-col h-full overflow-y-auto scrollbar-hide", isCollapsed && "px-3")}>
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Branding */}
        <div className={cn("flex items-center gap-3 mb-8 px-1 shrink-0", isCollapsed && "justify-center px-0")}>
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-xs font-semibold uppercase">V</span>
          </div>
          {!isCollapsed && <span className="text-lg font-serif font-medium tracking-tight">Veritus</span>}
        </div>

        {/* User Profile Detail Section */}
        <div className={cn(
          "mb-6 bg-zinc-50/50 rounded-2xl border border-zinc-100 shrink-0 transition-all",
          isCollapsed ? "p-2 rounded-xl" : "p-5"
        )}>
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="relative shrink-0">
              <img 
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" 
                alt="Avatar" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate leading-tight text-zinc-900">{user.name}</div>
                <div className="text-[10px] font-medium text-zinc-400 mt-0.5 uppercase tracking-widest">{user.role}</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center justify-center gap-2 py-2 bg-white border border-zinc-200 rounded-lg text-[9px] font-medium text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm"
              >
                <UserCircle size={12} className="stroke-2" />
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 py-2 bg-white border border-zinc-200 rounded-lg text-[9px] font-medium text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm"
              >
                <LogOut size={12} className="stroke-2" />
                Logout
              </button>
            </div>
          )}
        </div>

        <nav className={cn("flex-1 space-y-1", isCollapsed && "space-y-4")}>
          {!isCollapsed && <div className="px-3 mb-2 text-[10px] font-medium text-zinc-300 uppercase tracking-wider">Main Workflow</div>}
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={pathname === '/dashboard'} 
            onClick={() => router.push('/dashboard')}
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={Kanban} 
            label="Kanban Board" 
            active={pathname === '/kanban'} 
            onClick={() => router.push('/kanban')}
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            icon={Calendar} 
            label="Project Calendar" 
            active={pathname === '/calendar'} 
            onClick={() => router.push('/calendar')}
            isCollapsed={isCollapsed}
          />
          
          {user.role_level <= 3 && (
            <>
              {!isCollapsed && <div className="pt-6 pb-2 px-3 text-[10px] font-medium text-zinc-300 uppercase tracking-wider">Infrastructure</div>}
              <SidebarItem 
                icon={TrendingUp} 
                label="Strategic Analytics" 
                active={pathname === '/analytics'} 
                onClick={() => router.push('/analytics')}
                isCollapsed={isCollapsed}
              />
              {user.role_level === 0 && (
                <>
                  <SidebarItem 
                    icon={UsersIcon} 
                    label="User Directory" 
                    active={pathname === '/users'} 
                    onClick={() => router.push('/users')}
                    isCollapsed={isCollapsed}
                  />
                  <SidebarItem 
                    icon={ShieldCheck} 
                    label="System Health" 
                    active={pathname === '/logs'} 
                    onClick={() => router.push('/logs')}
                    isCollapsed={isCollapsed}
                  />
                </>
              )}
            </>
          )}

          <div className={cn("pt-6", !isCollapsed && "pb-2 px-3")}>
             {!isCollapsed && <div className="text-[10px] font-medium text-zinc-300 uppercase tracking-wider mb-2">Quick Actions</div>}
          </div>
          <button className={cn(
            "flex items-center w-full text-xs font-medium text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all shadow-md group",
            isCollapsed ? "h-12 justify-center" : "gap-3 px-4 py-3"
          )}>
            <div className={cn("p-1 bg-white/10 rounded-lg group-hover:scale-105 transition-transform", isCollapsed && "p-1.5")}>
              <Plus size={16} />
            </div>
            {!isCollapsed && <span>New Task</span>}
          </button>
        </nav>
        
        <div className={cn("mt-auto pt-6 border-t border-zinc-100", isCollapsed && "flex justify-center")}>
          <div className="flex items-center gap-2 px-1 text-[9px] font-semibold text-zinc-300 uppercase tracking-widest leading-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            {!isCollapsed && <span>Systems Online</span>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Integrated into natural flow, no longer fixed */}
      <aside className="hidden lg:flex flex-col flex-none bg-white relative z-50">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar: High-Fidelity Animated Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            {/* Backdrop: Recesses the content area with blurring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md"
            />
            
            {/* Sidebar Drawer: Precise width and standardized positioning */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-110"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
