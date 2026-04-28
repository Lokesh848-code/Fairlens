import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Database,
  Search,
  Download,
  Filter,
  Plus,
  ShieldCheck,
  History
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const fairnessData = [
  { name: "Jan", score: 72 },
  { name: "Feb", score: 68 },
  { name: "Mar", score: 85 },
  { name: "Apr", score: 82 },
  { name: "May", score: 89 },
  { name: "Jun", score: 92 },
];

const biasByAge = [
  { group: "18-24", selectionRate: 0.35, parityLink: 0.42 },
  { group: "25-34", selectionRate: 0.88, parityLink: 0.92 },
  { group: "35-44", selectionRate: 0.91, parityLink: 0.95 },
  { group: "45-54", selectionRate: 0.84, parityLink: 0.88 },
  { group: "55+", selectionRate: 0.42, parityLink: 0.51 },
];

export default function DashboardOverviewPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit/summary")
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const statsList = [
    { label: "Avg Fairness Score", value: loading ? "..." : (summary?.fairnessScore || "0"), unit: "/100", trend: "+4.2%", icon: TrendingUp, color: "text-emerald-500" },
    { label: "Critical Disparities", value: "02", unit: "", trend: "-1", icon: ShieldAlert, color: "text-red-500" },
    { label: "Audited Records", value: "1.2M", unit: "", trend: "+120k", icon: Users, color: "text-indigo-500" },
    { label: "Data Health", value: "96.8", unit: "%", trend: "+0.5%", icon: Database, color: "text-emerald-500" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div id="dashboard-header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Global Overview</h1>
            <p className="text-slate-500 font-medium mt-1">
              {summary?.modelName ? `Latest: ${summary.modelName}` : "Aggregated fairness metrics across active models."}
            </p>
          </div>
          <div id="header-actions" className="flex gap-3">
            <Button 
                id="btn-download-report" 
                variant="outline" 
                className="h-10 bg-white border-slate-200 shadow-sm font-bold transition-all hover:bg-slate-50 active:scale-95"
                onClick={() => {
                   toast.success("Generating Secure PDF Metadata...");
                   setTimeout(() => {
                      const blob = new Blob(["FairLens System Report\nGenerated: " + new Date().toISOString() + "\nGlobal Fairness: 88.4"], { type: "text/plain" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'fairlens_global_audit.txt';
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      toast.success("Report Exported Successfully");
                   }, 1500);
                }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button id="btn-new-audit" className="h-10 font-bold shadow-lg shadow-primary/20" onClick={() => navigate("/audit")}>
              <Plus className="w-4 h-4 mr-2" />
              New Audit
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div id="stats-summary-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, i) => (
            <Card id={`stat-card-${i}`} key={i} className="border-slate-200 shadow-sm bg-white overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-slate-50 ${stat.color} border border-slate-100 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-bold py-0.5",
                    stat.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100"
                  )}>
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                    <span className="text-slate-400 text-sm font-medium">{stat.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div id="charts-row" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <Card id="fairness-trend-card" className="lg:col-span-8 border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-6">
              <div>
                <CardTitle className="text-lg font-bold">Fairness Trend</CardTitle>
                <CardDescription>Aggregate fairness score over the last 6 months.</CardDescription>
              </div>
              <div id="chart-controls" className="flex gap-2">
                <Button id="btn-1m" variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-400">1M</Button>
                <Button id="btn-3m" variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-400">3M</Button>
                <Button id="btn-6m" variant="secondary" size="sm" className="h-8 text-xs font-bold">6M</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fairnessData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                      dx={-10}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--primary)" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail Column */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[230px]">
              <CardHeader className="py-4 border-b border-slate-50">
                <CardTitle className="text-sm font-bold tracking-tight uppercase text-slate-400">Audit Queue</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col divide-y divide-slate-50 overflow-y-auto">
                {[
                  { name: "Hiring_Model_v2", status: "In Progress", color: "text-indigo-500", progress: 65 },
                  { name: "Risk_Scorer_Final", status: "Queued", color: "text-slate-400", progress: 0 },
                  { name: "Health_Audit_Alpha", status: "Error", color: "text-red-500", progress: 12 },
                ].map((job, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-700">{job.name}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${job.color}`}>{job.status}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        className={cn("h-full", job.status === "Error" ? "bg-red-500" : "bg-indigo-500")}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card id="audit-trail-card" className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[280px]">
               <CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold tracking-tight uppercase text-slate-400 italic">System Audit Trail</CardTitle>
                  <History className="w-3 h-3 text-slate-300" />
               </CardHeader>
               <CardContent className="p-0 overflow-y-auto">
                  <div className="divide-y divide-slate-50 italic">
                     {[
                        { event: "JWT Refresh", time: "2m ago", user: "Admin", status: "Success" },
                        { event: "Model Deploy", time: "14m ago", user: "ML_Ops", status: "Warning" },
                        { event: "Record Audit", time: "32m ago", user: "System", status: "Success" },
                        { event: "Access Grant", time: "1h ago", user: "Admin", status: "Success" },
                        { event: "Login Attempt", time: "3h ago", user: "Guest", status: "Denied" },
                     ].map((log, i) => (
                        <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-slate-900 tracking-tight">{log.event}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.time}</span>
                           </div>
                           <Badge variant="ghost" className={cn(
                              "text-[9px] font-bold p-0",
                              log.status === "Success" ? "text-emerald-500" : (log.status === "Warning" ? "text-amber-500" : "text-red-500")
                           )}>
                              {log.status}
                           </Badge>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Chart Row */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Metric Breakdown</CardTitle>
              <CardDescription>Selection parity across different age demographics.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={biasByAge}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="group" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="selectionRate" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} name="Selection Rate" />
                  <Bar dataKey="parityLink" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} name="Parity Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="pt-4 text-left">
           <h3 className="text-lg font-bold italic tracking-tight text-slate-900 mb-6">Recent Security Activity</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Anomaly Detected", desc: "Outlier detection triggered for 'Loan_Screener_Main'. Variance > 12%.", time: "2h ago", type: "alert" },
                { title: "Audit Signed", desc: "Compliance dossier for 'Hiring_v3' verified by Erik Lokissen.", time: "5h ago", type: "success" },
              ].map((activity, i) => (
                <Card key={i} className="border-slate-200 bg-white p-5 flex items-start gap-4">
                   <div className={cn(
                     "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                     activity.type === "alert" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                   )}>
                      {activity.type === "alert" ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="text-sm font-bold text-slate-900 italic tracking-tight">{activity.title}</h4>
                         <span className="text-[10px] font-bold text-slate-400">{activity.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{activity.desc}</p>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
