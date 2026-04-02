"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        toast.error("Authentication failed. Please check your credentials.");
      } else {
        toast.success("Security Clearance Granted. Level-0 access authorized.");
        // Short delay to allow toast to be seen
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      }

    } catch (err: any) {
      setError(err.message || "An unexpected security error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-6 selection:bg-zinc-900 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm p-10 bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-zinc-200">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Veritus Workspace</h1>
          <p className="text-zinc-400 text-sm font-medium">Secure hierarchical access control.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-3.5 bg-zinc-50 border border-zinc-200 text-red-600 text-xs font-semibold rounded-xl text-center shadow-sm"
              >
                {error.includes("Invalid login credentials") ? "Invalid Login Credentials" : error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-400 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@veritus.com"
              required
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-300 transition-all font-semibold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-400 ml-1">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-300 transition-all font-semibold text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-sm"
          >
            {loading ? "Authenticating..." : "Sign In to Veritus"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-4">Authorized Personnel Only</p>
          <p className="text-xs text-zinc-400 leading-relaxed px-2">
            Account missing? Contact your <span className="font-bold text-zinc-900">IT Administrator</span> to be assigned a workspace.
          </p>
        </div>
      </motion.div>
    </div>

  );
}
