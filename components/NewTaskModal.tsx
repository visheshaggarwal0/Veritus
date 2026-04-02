"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Terminal, 
  ShieldCheck, 
  Calendar as CalendarIcon,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { User, Role, Priority, ROLE_LEVELS } from "@/lib/types";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function NewTaskModal({ isOpen, onClose, currentUser }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState("");
  const [subordinates, setSubordinates] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchSubordinates();
    }
  }, [isOpen]);

  const fetchSubordinates = async () => {
    const { data: users } = await supabase
      .from("profiles")
      .select("*")
      .order("name", { ascending: true });

    if (users) {
      // Filter by hierarchy: role_level > currentUser.role_level
      // and optionally same department unless executive
      const isExecutive = currentUser.role_level <= 1;
      const filtered = (users as User[]).filter(u => {
        const isSubordinate = u.role_level > currentUser.role_level;
        const isSameDept = u.department_id === currentUser.department_id;
        return isSubordinate && (isExecutive || isSameDept);
      });
      setSubordinates(filtered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignedTo || !deadline) return;
    
    setLoading(true);
    const { error } = await supabase.from("tasks").insert([{
      title,
      description,
      assigned_by: currentUser.id,
      assigned_to: assignedTo,
      priority,
      status: "pending",
      deadline: new Date(deadline).toISOString(),
    }]);

    if (!error) {
      // Add notification for assignee
      await supabase.from("notifications").insert([{
        user_id: assignedTo,
        message: `New task assigned: ${title}`,
        type: "assignment",
      }]);
      
      onClose();
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDeadline("");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900" />
            
            <section className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-zinc-900 text-white rounded-xl shadow-md">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">Initialize New Task</h2>
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Strategic Assignment Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-50 rounded-lg transition-all text-zinc-300 hover:text-zinc-900"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Task Objective</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all font-semibold text-sm"
                    placeholder="Enter short mission title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Mission Details</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-300 transition-all font-medium text-sm min-h-[100px] resize-none"
                    placeholder="Provide context and key requirements..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Assign to Personnel</label>
                    <div className="relative">
                      <select 
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none appearance-none font-semibold text-sm cursor-pointer"
                      >
                        <option value="">Select Subordinate...</option>
                        {subordinates.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name} — {sub.role}</option>
                        ))}
                      </select>
                      <UserIcon size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Priority Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as Priority[]).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                            priority === p ? "bg-zinc-900 text-white border-zinc-900 shadow-md" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                   <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">Mission Deadline</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none appearance-none font-semibold text-sm cursor-pointer"
                      />
                      <CalendarIcon size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                     <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                    >
                      {loading ? "Initializing..." : (
                        <>
                          <ShieldCheck size={16} />
                          Confirm Directive
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>
            
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Secure Transmission</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Access Validated</span>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

// Utils import
import { cn } from "@/lib/types";
