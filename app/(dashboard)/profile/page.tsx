"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User, ShieldCheck, Mail, Building2, UserCircle, LogOut } from "lucide-react";
import { Badge } from "@/components/Badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User as UserType } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        if (data) setProfile(data as UserType);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-in fade-in duration-500">
        <div className="w-10 h-10 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 font-semibold text-xs uppercase tracking-widest">Accessing Identity Node...</p>
      </div>
    );
  }

  if (!profile) return null;

  const stats = [
    { label: "Strategic Level", value: `Rank ${profile.role_level}`, icon: ShieldCheck },
    { label: "Operational Unit", value: profile.department_id || "Global infrastructure", icon: Building2 },
    { label: "Authorization", value: profile.role, icon: UserCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-1 font-display">Personnel Profile</h1>
          <p className="text-zinc-400 font-medium text-sm">Manage your hierarchical identity and operational metadata.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-500 text-xs font-bold hover:bg-red-50 transition-all rounded-lg group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900" />
            <div className="relative mb-6">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                alt=""
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-1 font-display">{profile.name}</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{profile.role}</p>
            <Badge variant={profile.role_level === 0 ? "reviewed" : "default"}>
              Auth Level {profile.role_level}
            </Badge>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 text-white relative overflow-hidden group shadow-lg">
             <div className="relative z-10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 font-display">Security Protocol</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Encrypted Communication</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">RLS Validated Node</span>
                 </div>
               </div>
             </div>
             <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:rotate-12 transition-all duration-1000 stroke-[1]" />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 font-display px-1">Operational Metadata</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                      <stat.icon size={18} className="text-zinc-900" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">{stat.label}</div>
                      <div className="text-sm font-bold text-zinc-900 font-display">{stat.value}</div>
                    </div>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>
              ))}
              
              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                      <Mail size={18} className="text-zinc-900" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Communication Node</div>
                      <div className="text-sm font-bold text-zinc-900 font-display">{profile.email}</div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-all">Request Update</button>
                </div>
            </div>
          </div>

          <div className="p-8 bg-white border border-zinc-100 rounded-xl shadow-sm text-center">
            <p className="text-xs text-zinc-400 font-medium">To modify your hierarchy level or operational unit, please contact the <span className="text-zinc-900 font-bold">IT Infrastructure Admin</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
