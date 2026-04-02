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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-3xl border border-zinc-100 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-zinc-100 via-zinc-900 to-zinc-100" />
            
            <section className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl shadow-zinc-200">
                    <Terminal size={20} className="stroke-3" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Directive Initialization</h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Strategic Task Assignment Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-zinc-50 rounded-2xl transition-all text-zinc-300 hover:text-zinc-900"
                >
                  <X size={24} className="stroke-3" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Objective Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-sm"
                    placeholder="Briefly describe the mission objective..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Mission Intelligence (Description)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-medium text-sm min-h-[120px] resize-none"
                    placeholder="Provide full context and technical requirements..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Assign to Personnel</label>
                    <div className="relative">
                      <select 
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        required
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none appearance-none font-bold text-sm cursor-pointer"
                      >
                        <option value="">Select Subordinate...</option>
                        {subordinates.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name} — {sub.role}</option>
                        ))}
                      </select>
                      <UserIcon size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Directive Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as Priority[]).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            priority === p ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-900"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2">Mission Deadline</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none appearance-none font-bold text-sm cursor-pointer"
                      />
                      <CalendarIcon size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                     <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                    >
                      {loading ? "INITIALIZING..." : (
                        <>
                          <ShieldCheck size={18} className="stroke-3" />
                          Confirm Strategy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">Encrypted Transmission</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">RLS Validated</span>
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
