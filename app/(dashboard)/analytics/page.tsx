"use client";

import { useState, useEffect } from "react";
import { getAnalyticsData } from "./actions";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from 'recharts';
import { 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Target,
  ArrowUpRight,
  Clock,
  Layers
} from 'lucide-react';
import { cn } from "@/lib/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const stats = await getAnalyticsData();
      if (!stats.error) setData(stats);
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent rounded-3xl animate-spin mb-6" />
        <p className="text-zinc-400 font-semibold text-[10px] uppercase tracking-[0.3em] italic">Reconstructing Strategic Metrics...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4 px-1">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-900 mb-1">Operational Intelligence</h1>
          <p className="text-zinc-500 font-medium text-sm">High-authority roll-up of <span className="font-semibold text-zinc-900">Weber Innovations</span> departmental performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-zinc-100 rounded-xl shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-900">Real-Time Core Connection</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
             <Target size={100} className="text-zinc-900 stroke-1" />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-semibold text-zinc-300 uppercase tracking-[0.2em] mb-3">Tactical Yield</div>
            <div className="text-4xl font-semibold text-zinc-900 tracking-tighter mb-2 italic">{data.productivity}%</div>
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-wider">
               <TrendingUp size={14} className="stroke-2" />
               Target Synchronized
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:-translate-y-4 transition-transform">
             <ShieldAlert size={140} className="text-white stroke-1" />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-3">Overdue Directives</div>
            <div className="text-4xl font-semibold tracking-tighter mb-2 italic">
               {data.overdueCount > 0 ? `0${data.overdueCount}` : '00'}
            </div>
            <div className={cn(
              "flex items-center gap-2 font-semibold text-xs uppercase tracking-wider",
              data.overdueCount > 0 ? "text-red-400" : "text-zinc-500"
            )}>
               <Clock size={14} className="stroke-2" />
               {data.overdueCount > 0 ? "Strategic Delay Detected" : "Timeline Integrity Maintained"}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm flex flex-col justify-between">
           <div>
             <div className="text-[10px] font-semibold text-zinc-300 uppercase tracking-[0.2em] mb-3">Total Directives</div>
             <div className="text-4xl font-semibold text-zinc-900 tracking-tighter mb-2 italic">{data.totalCount}</div>
           </div>
           <div className="flex items-center gap-2 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
               <Layers size={14} className="stroke-2" />
               Operational Scope
            </div>
        </div>

        <div className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm flex flex-col justify-between">
           <div>
             <div className="text-[10px] font-semibold text-zinc-300 uppercase tracking-[0.2em] mb-3">Health Metric</div>
             <div className="text-4xl font-semibold text-zinc-900 tracking-tighter mb-2 italic">A+</div>
           </div>
           <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-wider">
               <ShieldAlert size={14} className="stroke-2" />
               Hierarchy Secure
            </div>
        </div>
      </div>

      {/* Vizualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Status Distribution */}
        <section className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 italic">Directive Status Distribution</h3>
              <p className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest mt-1">Cross-Personnel Workflow Snapshot</p>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded-xl text-zinc-900 group-hover:scale-110 transition-transform">
              <Activity size={18} className="stroke-2" />
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.statusChart.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderRadius: '20px', 
                    border: 'none',
                    padding: '12px 20px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {data.statusChart.map((stat: any) => (
              <div key={stat.name} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-semibold text-zinc-300 uppercase tracking-widest leading-none mb-1">{stat.name}</span>
                  <span className="text-xs font-semibold text-zinc-900 leading-none">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priority Radar / Loading */}
        <section className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm flex flex-col group">
           <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 italic">Priority Loading Map</h3>
              <p className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest mt-1">Resource Allocation Analysis</p>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded-xl text-zinc-900 group-hover:scale-110 transition-transform">
              <ShieldAlert size={18} className="stroke-2" />
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priorityChart} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#d4d4d8', fontSize: 10, fontWeight: 500 }} 
                   padding={{ left: 20, right: 20 }}
                />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: '#f4f4f5', radius: 20 }}
                   contentStyle={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '12px 16px' }}
                   itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#18181b" 
                  radius={[20, 20, 20, 20]} 
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 italic font-semibold text-xs">
                 {data.priorityChart.find((p: any) => p.name === 'High')?.value || 0}
               </div>
               <div>
                  <div className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest leading-none mb-1">Critical Tier</div>
                  <div className="text-[10px] font-medium text-zinc-900">Requires Monitoring</div>
               </div>
             </div>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-50 text-zinc-900 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition-all">
                Export Protocols <ArrowUpRight size={14} className="stroke-2" />
             </button>
          </div>
        </section>
      </div>

      {/* Advanced Performance Node (Radial Chart) */}
      <section className="p-10 bg-zinc-50 border border-zinc-100 rounded-[3rem] shadow-sm relative overflow-hidden group">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
               <div>
                 <h2 className="text-3xl font-serif font-medium tracking-tight text-zinc-900 mb-3">Strategic Capacity</h2>
                 <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-md">
                   Your current operational yield is at <span className="text-zinc-900 font-semibold">{data.productivity}%</span>. 
                   The infrastructure is sustaining efficient task throughput across all hierarchical tiers.
                 </p>
               </div>
               
               <div className="space-y-4">
                 <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <ShieldAlert size={22} className="stroke-2" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-0.5">Timeline Integrity</div>
                        <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Global Deadline Sync: Active</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                       <Target size={22} className="stroke-2" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-0.5">Hierarchical Validated</div>
                        <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Authority Flow Restrictive: Enabled</div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="h-[400px] flex items-center justify-center relative scale-110 lg:scale-125 transition-transform duration-1000 group-hover:scale-110">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                  <Activity size={350} className="text-zinc-900 stroke-1" />
               </div>
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={[{ name: 'Yield', value: data.productivity, fill: '#18181b' }]}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={20}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-4xl font-semibold fill-zinc-900 italic font-sans"
                    >
                      {data.productivity}%
                    </text>
                  </RadialBarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>
    </div>
  );
}
