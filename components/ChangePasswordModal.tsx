"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updatePasswordAction } from "@/app/(dashboard)/profile/actions";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Strategic keys do not match. Re-verify input.");
      return;
    }
    if (password.length < 8) {
      setError("Key strength insufficient. Minimum 8 characters required.");
      return;
    }

    setLoading(true);
    setError(null);

    const { success, error: updateError } = await updatePasswordAction(password);

    if (success) {
      toast.success("Security status updated.", {
        description: "New access key has been successfully rotating across all nodes.",
      });
      onClose();
    } else {
      setError(updateError || "Failed to update security credentials.");
    }
    setLoading(false);
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
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
          >
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900">Safety Key Update</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Operational Access Rotation</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider leading-relaxed">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">New Access Key</label>
                  <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                    <Lock size={16} className="text-zinc-300" />
                    <input
                      required
                      type="password"
                      placeholder="Minimum 8 characters..."
                      className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Confirm Signature</label>
                  <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                    <CheckCircle2 size={16} className="text-zinc-300" />
                    <input
                      required
                      type="password"
                      placeholder="Match signature..."
                      className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? "Rotating Keys..." : "Authorize Security Update"}
              </button>
            </form>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-loose">
                Veritus Military Grade Encryption <br />
                <span className="opacity-50">Identity re-validation may be required after update</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
