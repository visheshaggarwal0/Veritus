"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  User as UserIcon, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  ChevronRight,
  AtSign
} from 'lucide-react';
import { Task, User, Comment, cn } from "@/lib/types";
import { Badge } from "./Badge";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function TaskDetailModal({ task, isOpen, onClose, currentUser }: TaskDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && task) {
      fetchComments();
      fetchParticipants();
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const fetchComments = async () => {
    if (!task) return;
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("task_id", task.id)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  };

  const fetchParticipants = async () => {
    if (!task) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("id", [task.assigned_by, task.assigned_to]);

    if (data) {
      const userMap: Record<string, User> = {};
      data.forEach((u: User) => {
        userMap[u.id] = u;
      });
      setUsers(userMap);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim() || loading) return;

    setLoading(true);
    const { error } = await supabase
      .from("comments")
      .insert([{
        task_id: task.id,
        user_id: currentUser.id,
        text: newComment.trim()
      }]);

    if (!error) {
      setNewComment("");
      fetchComments();
    }
    setLoading(true);
    // Note: The SQL trigger we generated will handle the notification insertion.
    setLoading(false);
  };

  const assignor = task ? users[task.assigned_by] : null;
  const assignee = task ? users[task.assigned_to] : null;

  return (
    <AnimatePresence>
      {isOpen && task && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-zinc-900/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-zinc-100 relative"
          >
            {/* Left Sidebar: Task Context */}
            <div className="w-full md:w-[350px] border-r border-zinc-100 bg-zinc-50/30 p-8 flex flex-col shrink-0 overflow-y-auto scrollbar-hide">
              <div className="mb-8 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant={task.priority}>{task.priority} Tier</Badge>
                  <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
                </div>
                <h2 className="text-3xl font-serif font-medium tracking-tight text-zinc-900 leading-tight mb-4">
                  {task.title}
                </h2>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={14} className="stroke-2" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Deadline: {new Date(task.deadline).toLocaleDateString(undefined, { dateStyle: 'full' })}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-[0.3em] mb-4 italic">Personnel Context</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold italic">
                        {assignor?.name.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Assignor</div>
                        <div className="text-sm font-semibold text-zinc-900 leading-none">{assignor?.name || "Loading..."}</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ChevronRight size={16} className="text-zinc-200 rotate-90" />
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex items-center gap-4 ring-4 ring-emerald-500/5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold italic">
                        {assignee?.name.charAt(0) || "P"}
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-emerald-600/60 uppercase tracking-widest mb-0.5">Operational Lead</div>
                        <div className="text-sm font-semibold text-zinc-900 leading-none">{assignee?.name || "Loading..."}</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-[0.3em] mb-4 italic">Strategic Requirements</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                    {task.description || "No specific detailed requirements documented for this directive."}
                  </p>
                </section>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-100/50 hidden md:block">
                <div className="flex items-center gap-2 px-2 text-[9px] font-semibold text-zinc-300 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Directive ID: {task.id.slice(0, 8)}
                </div>
              </div>
            </div>

            {/* Right Pane: Tactical Communication Feed */}
            <div className="flex-1 flex flex-col bg-white relative">
              {/* Internal Header */}
              <div className="h-20 border-b border-zinc-100 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-900">
                    <MessageSquare size={20} className="stroke-3" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium text-zinc-900 italic">Tactical Feed</h3>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Cross-Personnel Communication Node</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-4 hover:bg-zinc-50 rounded-2xl transition-all text-zinc-300 hover:text-zinc-900 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Feed Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth scrollbar-hide"
              >
                {comments.length > 0 ? comments.map((comment) => {
                  const isMe = comment.user_id === currentUser.id;
                  const commenter = users[comment.user_id];
                  
                  return (
                    <motion.div 
                      key={comment.id}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex gap-4 max-w-[85%]",
                        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className="shrink-0 pt-1">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold border-2 border-white shadow-sm",
                          isMe ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                        )}>
                          {commenter?.name.charAt(0) || "?"}
                        </div>
                      </div>
                      <div className={cn(
                        "space-y-1.5",
                        isMe ? "text-right" : "text-left"
                      )}>
                        <div className="flex items-center gap-3 justify-end md:justify-start flex-row-reverse md:flex-row">
                          <span className="text-[10px] font-semibold text-zinc-900 uppercase tracking-wider italic">
                            {commenter?.name || "System Node"}
                          </span>
                          <span className="text-[9px] font-semibold text-zinc-300 uppercase tracking-widest">
                            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={cn(
                          "px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                          isMe 
                            ? "bg-zinc-900 text-white rounded-tr-none" 
                            : "bg-white border border-zinc-100 text-zinc-700 rounded-tl-none"
                        )}>
                          {comment.text.split(/(@\w+)/g).map((part, i) => (
                            part.startsWith("@") ? (
                              <span key={i} className="text-emerald-400 font-semibold">{part}</span>
                            ) : part
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 grayscale">
                    <div className="w-24 h-24 border-4 border-dashed border-zinc-900 rounded-4xl flex items-center justify-center mb-6">
                      <AtSign size={40} className="stroke-1" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900">Communication Node Inactive</p>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Await personnel update or initialize feedback</p>
                  </div>
                )}
              </div>

              {/* Command Input Area */}
              <div className="p-8 border-t border-zinc-100 bg-white shrink-0">
                <form 
                  onSubmit={postComment}
                  className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 p-4 pl-6 rounded-[2.5rem] focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-xl transition-all h-20"
                >
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Broadcast update..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-semibold text-zinc-900 placeholder:text-zinc-300"
                  />
                  <div className="h-8 w-px bg-zinc-200 mx-2" />
                  <button 
                    type="submit"
                    disabled={!newComment.trim() || loading}
                    className="h-12 w-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-20"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={18} className="translate-x-0.5 -translate-y-0.5 stroke-3" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
