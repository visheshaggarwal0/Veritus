"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updateAvatarAction } from "@/app/(dashboard)/profile/actions";
import { useState } from "react";

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onUpdate: (newAvatar: string) => void;
}

const AVATAR_SEEDS = [
  "Strategist", "Admin", "Executive", "Specialist", 
  "Operator", "Advisor", "Director", "Analyst",
  "Pilot", "Captain", "Officer", "Agent",
  "Consultant", "Architect", "Lead", "Technician",
  "Explorer", "Nomad"
];

const AVATARS = AVATAR_SEEDS.map(seed => 
  `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=f8f9fa`
);

export default function AvatarPicker({ isOpen, onClose, currentAvatar, onUpdate }: AvatarPickerProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleSelect = async (avatar: string) => {
    if (avatar === currentAvatar) return;
    setUpdating(avatar);
    
    const { success, error } = await updateAvatarAction(avatar);
    
    if (success) {
      toast.success("Strategic identity updated.", {
        description: "Your operational node now reflects the new visual signature.",
      });
      onUpdate(avatar);
      onClose();
    } else {
      toast.error("Protocol failure", { description: error });
    }
    setUpdating(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
          >
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900">Select Identity Node</h2>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1">Operational Visual Signature</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-4 gap-4">
                {AVATARS.map((avatar, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(avatar)}
                    disabled={!!updating}
                    className="relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: currentAvatar === avatar ? "#18181b" : "transparent",
                    }}
                  >
                    <img 
                      src={avatar} 
                      alt="" 
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        updating === avatar ? "opacity-50 scale-90" : "group-hover:scale-110"
                      }`}
                    />
                    
                    {currentAvatar === avatar && (
                      <div className="absolute inset-0 bg-zinc-900/10 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-zinc-900 fill-white" />
                      </div>
                    )}
                    
                    {updating === avatar && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-zinc-900 opacity-0 group-hover:opacity-5 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-loose">
                Veritus Strategic Asset Library <br />
                <span className="opacity-50">Authorized Personnel Only</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
