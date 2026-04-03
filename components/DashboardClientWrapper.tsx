"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { User } from "@/lib/types";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  user: User;
}

export function DashboardClientWrapper({ children, user }: DashboardClientWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hydrate collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setIsCollapsed(JSON.parse(saved));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
  };

  return (
    <div className="flex bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white min-h-screen relative overflow-x-hidden">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      <main className="flex-1 flex flex-col bg-zinc-50/40 relative min-h-screen transition-all duration-300">
        <DashboardHeader 
          currentUser={user} 
          onMenuClick={toggleSidebar} 
        />
        <div className="flex-1 p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
