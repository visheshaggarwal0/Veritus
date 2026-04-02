import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/types';

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
      "flex items-center w-full gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg group relative",
      active 
        ? "bg-zinc-100 text-zinc-900 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-zinc-900 before:rounded-full" 
        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
    )}
  >
    <Icon size={18} className={cn("transition-transform duration-200 stroke-2", active ? "scale-105" : "group-hover:scale-105")} />
    <span>{label}</span>
  </button>
);

