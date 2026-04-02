import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
      } else {
        router.push("/dashboard");
        router.refresh();
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-white border border-zinc-200 rounded-[2.5rem] shadow-2xl shadow-zinc-200"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-zinc-200 rotate-3">
            <span className="text-white text-3xl font-black italic -rotate-3">V</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2">VERITUS</h1>
          <p className="text-zinc-500 text-sm font-medium">Log in to your secure hierarchical workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.4 } 
                }}
                exit={{ opacity: 0, x: 10 }}
                className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl text-center shadow-sm"
              >
                {error.includes("Invalid login credentials") ? "SECURITY ALERT: WRONG CREDENTIALS" : error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alexander@veritus.com"
              required
              className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium text-sm"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN TO VERITUS"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-4">Enterprise Access Only</p>
          <p className="text-xs text-zinc-500">
            Account missing? Contact your <span className="font-bold text-zinc-900">IT Administrator</span> to be assigned a workspace.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
