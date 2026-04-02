import { ReactNode } from 'react';
import { cn } from '@/lib/types';

export const Badge = ({ children, variant = 'default' }: { children: ReactNode, variant?: string }) => {
  const variants: Record<string, string> = {
    default: "bg-zinc-50 text-zinc-600 border border-zinc-100",
    high: "bg-zinc-900 text-white shadow-sm",
    medium: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    low: "bg-zinc-50 text-zinc-400 border border-zinc-100",
    pending: "bg-zinc-50 text-zinc-500 border border-zinc-100",
    in_progress: "bg-zinc-900 text-white font-medium shadow-sm",
    completed: "bg-zinc-100 text-zinc-800 font-medium border border-zinc-200",
    reviewed: "bg-zinc-50 text-zinc-900 font-semibold border border-zinc-900/10",
  };
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all duration-200 inline-flex items-center justify-center", 
      variants[variant] || variants.default
    )}>
      {children}
    </span>
  );
};

