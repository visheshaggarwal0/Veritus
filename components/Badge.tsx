import { ReactNode } from 'react';
import { cn } from '../types';

export const Badge = ({ children, variant = 'default' }: { children: ReactNode, variant?: string }) => {
  const variants: Record<string, string> = {
    default: "bg-zinc-100 text-zinc-600",
    high: "bg-zinc-900 text-white",
    medium: "bg-zinc-200 text-zinc-800",
    low: "bg-zinc-50 text-zinc-400 border border-zinc-100",
    pending: "bg-zinc-100 text-zinc-500",
    in_progress: "bg-zinc-900 text-white",
    completed: "bg-zinc-200 text-zinc-800",
    reviewed: "bg-zinc-100 text-zinc-900 font-bold border border-zinc-900",
  };
  
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};
