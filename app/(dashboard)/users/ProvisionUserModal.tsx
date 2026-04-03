"use client";

import { useState } from "react";
import { Plus, X, UserCircle, Mail, ShieldCheck, Building2 } from "lucide-react";
import { provisionUserAction } from "./actions";
import { useRouter } from "next/navigation";

interface ProvisionUserModalProps {
  onClose: () => void;
}

export function ProvisionUserModal({ onClose }: ProvisionUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Junior Associate",
    role_level: 5,
    department_name: "Executives"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await provisionUserAction(formData);
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to provision node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-zinc-100 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-display">Provision Strategic Node</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 italic">New identity initialization protocol.</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors">
            <X size={20} className="stroke-2" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Tactical Identity</label>
              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                <UserCircle size={16} className="text-zinc-300" />
                <input
                  required
                  placeholder="Full Name..."
                  className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Comms Protocol (Email)</label>
              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                <Mail size={16} className="text-zinc-300" />
                <input
                  required
                  type="email"
                  placeholder="name@veritus.in..."
                  className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold placeholder:text-zinc-300"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Authorization Rank</label>
                <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                  <ShieldCheck size={16} className="text-zinc-300" />
                  <select
                    className="bg-transparent border-none focus:outline-none text-xs w-full font-bold text-zinc-900"
                    value={formData.role_level}
                    onChange={e => {
                      const level = parseInt(e.target.value);
                      const roleMap: Record<number, string> = {
                        0: "IT Administrator",
                        1: "CEO / Managing Director",
                        2: "Department Head",
                        3: "Project Manager",
                        4: "Senior Associate",
                        5: "Junior Associate"
                      };
                      setFormData({ ...formData, role_level: level, role: roleMap[level] });
                    }}
                  >
                    <option value={0}>Rank 0 (IT Admin)</option>
                    <option value={1}>Rank 1 (CEO / Exec)</option>
                    <option value={2}>Rank 2 (Head)</option>
                    <option value={3}>Rank 3 (Manager)</option>
                    <option value={4}>Rank 4 (Senior)</option>
                    <option value={5}>Rank 5 (Junior)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Operational Unit</label>
                <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                  <Building2 size={16} className="text-zinc-300" />
                  <input
                    required
                    placeholder="Executives, R&D..."
                    className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold text-zinc-900 placeholder:text-zinc-300"
                    value={formData.department_name}
                    onChange={e => setFormData({ ...formData, department_name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-800 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "Initializing Identity..." : "Authorize Provisioning"}
          </button>
        </form>
      </div>
    </div>
  );
}
