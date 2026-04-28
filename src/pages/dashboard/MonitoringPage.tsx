import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  History, 
  Bell,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
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

const driftData = [
  { time: "00:00", parity: 0.82, accuracy: 0.91 },
  { time: "04:00", parity: 0.81, accuracy: 0.92 },
  { time: "08:00", parity: 0.78, accuracy: 0.90 },
  { time: "12:00", parity: 0.74, accuracy: 0.88 },
  { time: "16:00", parity: 0.69, accuracy: 0.86 },
  { time: "20:00", parity: 0.72, accuracy: 0.87 },
  { time: "23:59", parity: 0.75, accuracy: 0.88 },
];

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div id="monitoring-header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Live Monitoring</h1>
              <p className="text-slate-500 font-medium mt-1">Real-time fairness tracking and performance drift detection.</p>
           </div>
           <div id="monitoring-timeframe" className="flex bg-white p-1 rounded-xl border border-slate-200">
              <Button id="btn-past-24h" size="sm" variant="ghost" className="h-8 text-xs font-bold text-slate-400">Past 24h</Button>
              <Button id="btn-real-time" size="sm" className="h-8 text-xs font-bold bg-primary text-white shadow-sm">Real-time</Button>
           </div>
        </div>

        {/* Global Health Banner */}
        <div id="monitoring-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card id="drift-chart-card" className="lg:col-span-2 border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-6">
                 <div>
                    <CardTitle className="text-lg font-bold italic tracking-tight">Fairness Drift (Demographic Parity)</CardTitle>
                    <CardDescription>Continuous monitoring of production traffic.</CardDescription>
                 </div>
                 <div id="live-indicator" className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest italic animate-pulse">
                    <Activity className="w-4 h-4" /> Live
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={driftData}>
                          <defs>
                             <linearGradient id="colorParity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} domain={[0, 1]} />
                          <Tooltip 
                             contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="parity" name="Fairness Score" stroke="#6366f1" strokeWidth={3} fill="url(#colorParity)" />
                          <Line type="monotone" dataKey="accuracy" name="Model Accuracy" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-8">
              <Card className="border-red-100 bg-red-50/50 border-2 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-6 border-b border-red-100 bg-red-100/20 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4" /> Critical Alert
                    </h3>
                    <span className="text-[10px] font-bold text-red-500">12m ago</span>
                 </div>
                 <CardContent className="p-6">
                    <p className="text-sm font-bold text-red-900 italic mb-2 tracking-tight">Sudden Fairness Drop</p>
                    <p className="text-xs text-red-700 font-medium leading-relaxed mb-6">
                       Demographic Parity for <strong className="text-red-900">'Ethicity: Minoritized'</strong> group has dropped below 0.70 threshold in the latest 1,000 production inferences.
                    </p>
                    <div className="flex gap-2">
                       <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1">Isolate Model</Button>
                       <Button size="sm" variant="outline" className="border-red-200 text-red-700 font-bold flex-1">View Trace</Button>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm bg-white p-6">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-500" /> System Health
                 </h3>
                 <div className="space-y-4">
                    {[
                       { label: "Audit Latency", value: "42ms", trend: "Stable", icon: ShieldCheck, color: "text-emerald-500" },
                       { label: "Log Throughput", value: "5.2k/s", trend: "+12%", icon: TrendingUp, color: "text-indigo-500" },
                    ].map((h, i) => (
                       <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className={cn("p-1.5 rounded-lg bg-white shadow-sm border border-slate-100", h.color)}>
                                <h.icon className="w-3 h-3" />
                             </div>
                             <span className="text-xs font-bold text-slate-600">{h.label}</span>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-bold text-slate-900">{h.value}</div>
                             <div className={cn("text-[9px] font-bold uppercase", h.color === "text-red-500" ? "text-red-500" : "text-emerald-500")}>{h.trend}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>

        {/* Live Event Stream */}
        <Card id="event-stream-card" className="border-slate-200 shadow-sm bg-white overflow-hidden">
           <CardHeader className="py-6 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-lg font-bold italic tracking-tight">Active Audit Stream</CardTitle>
                 <CardDescription>Historical log of automated drift tests.</CardDescription>
              </div>
              <Button id="btn-refresh-stream" variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
                 <RefreshCw className="w-4 h-4" />
              </Button>
           </CardHeader>
           <div className="divide-y divide-slate-50">
              {[
                { time: "14:32:01", event: "Automated Resampling Triggered", target: "Hiring_v3", status: "Completed", color: "text-emerald-500" },
                { time: "14:28:45", event: "Fairness Alert: Parity < 0.75", target: "Risk_Scorer", status: "Active", color: "text-red-500" },
                { time: "14:15:12", event: "Regulatory Periodic Scan", target: "System-wide", status: "Success", color: "text-emerald-500" },
                { time: "13:45:30", event: "New Data Schema Detected", target: "Core_Dataset", status: "Warning", color: "text-amber-500" },
              ].map((ev, i) => (
                <div key={i} className="p-4 px-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                   <div className="flex items-center gap-6">
                      <span className="text-xs font-mono font-medium text-slate-400">{ev.time}</span>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{ev.event}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ev.target}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <Badge variant="outline" className={cn("text-[9px] font-bold h-5 px-3 rounded-full", ev.color.replace('text-', 'bg-').replace('500', '50'))}>{ev.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                         <ChevronRight className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
              ))}
           </div>
           <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
              <Button variant="link" className="text-xs font-bold text-primary group">
                Access Deep Audit History
                <ArrowUpRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
