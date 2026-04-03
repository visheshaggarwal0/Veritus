import { useState, useEffect } from "react";
import { Plus, X, UserCircle, Mail, ShieldCheck, Building2, Layout } from "lucide-react";
import { provisionUserAction } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProvisionUserModalProps {
  onClose: () => void;
}

export function ProvisionUserModal({ onClose }: ProvisionUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Junior Associate",
    role_level: 5,
    department_name: ""
  });

  useEffect(() => {
    async function fetchDepts() {
      const { data } = await supabase
        .from("departments")
        .select("id, name")
        .order("name");
      
      if (data) {
        setDepartments(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, department_name: data[0].name }));
        }
      }
    }
    fetchDepts();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department_name) {
      setError("Please select a valid operational department.");
      return;
    }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-zinc-100 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900" />
        
        <div className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
          <div>
            <h2 className="text-2xl font-serif font-medium tracking-tight text-zinc-900">Provision Strategic Node</h2>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5 italic">Identity initialization protocol v2.1</p>
          </div>
          <button onClick={onClose} className="p-2 border border-zinc-100 rounded-xl text-zinc-300 hover:text-zinc-900 transition-all">
            <X size={18} className="stroke-2" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-[10px] font-semibold text-red-600 uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] px-2 italic">Tactical Identity</label>
              <div className="flex items-center gap-4 bg-zinc-50/50 px-5 py-4 rounded-2xl border border-zinc-100 focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-xl transition-all">
                <UserCircle size={18} className="text-zinc-400 stroke-2" />
                <input
                  required
                  placeholder="Full name of personnel..."
                  className="bg-transparent border-none focus:outline-none text-sm w-full font-semibold text-zinc-900 placeholder:text-zinc-300"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] px-2 italic">Comms Protocol (Email)</label>
              <div className="flex items-center gap-4 bg-zinc-50/50 px-5 py-4 rounded-2xl border border-zinc-100 focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-xl transition-all">
                <Mail size={18} className="text-zinc-400 stroke-2" />
                <input
                  required
                  type="email"
                  placeholder="Official veritus identity..."
                  className="bg-transparent border-none focus:outline-none text-sm w-full font-semibold text-zinc-900 placeholder:text-zinc-300"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] px-2 italic">Initial Access Key (Password)</label>
              <div className="flex items-center gap-4 bg-zinc-50/50 px-5 py-4 rounded-2xl border border-zinc-100 focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-xl transition-all">
                <ShieldCheck size={18} className="text-zinc-400 stroke-2" />
                <input
                  required
                  type="password"
                  placeholder="Set high-entropy key..."
                  className="bg-transparent border-none focus:outline-none text-sm w-full font-semibold text-zinc-900 placeholder:text-zinc-300"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] px-2 italic">Authorization Rank</label>
                <div className="flex items-center gap-3 bg-zinc-50/50 px-5 py-4 rounded-2xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                  <select
                    className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold text-zinc-900 cursor-pointer"
                    value={formData.role_level}
                    onChange={e => {
                      const level = parseInt(e.target.value);
                      const roleMap: Record<number, string> = {
                        1: "CEO / CSO / COO",
                        2: "COO Associates",
                        3: "Department Heads",
                        4: "Senior Associates",
                        5: "Junior Associates"
                      };
                      setFormData({ ...formData, role_level: level, role: roleMap[level] });
                    }}
                  >
                    <option value={1}>RANK 1 (CEO / CSO / COO)</option>
                    <option value={2}>RANK 2 (COO ASSOCIATES)</option>
                    <option value={3}>RANK 3 (DEPT HEADS)</option>
                    <option value={4}>RANK 4 (SENIOR ASSOCIATES)</option>
                    <option value={5}>RANK 5 (JUNIOR ASSOCIATES)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] px-2 italic">Operational Unit</label>
                <div className="flex items-center gap-3 bg-zinc-50/50 px-5 py-4 rounded-2xl border border-zinc-100 focus-within:border-zinc-300 transition-all">
                  <Building2 size={18} className="text-zinc-400 stroke-2" />
                  <select
                    required
                    className="bg-transparent border-none focus:outline-none text-xs w-full font-semibold text-zinc-900 cursor-pointer"
                    value={formData.department_name}
                    onChange={e => setFormData({ ...formData, department_name: e.target.value })}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white text-[10px] font-semibold uppercase tracking-[0.3em] rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Authorize Provisioning"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
