import { LucideIcon } from 'lucide-react';
import { cn } from '../types';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      active 
        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
    )}
  >
    <Icon size={18} className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span>{label}</span>
  </button>
);
