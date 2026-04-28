import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  ChevronRight, 
  ArrowLeftRight, 
  Brain, 
  Fingerprint, 
  Zap,
  ShieldCheck,
  Info,
  HelpCircle,
  BarChart,
  Target
} from "lucide-react";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const shapData = [
  { feature: "Income", impact: 0.28 },
  { feature: "Credit Score", impact: 0.22 },
  { feature: "Employment Duration", impact: 0.15 },
  { feature: "Age", impact: -0.12 },
  { feature: "Debt-to-Income", impact: -0.08 },
  { feature: "Prev. Default", impact: -0.05 },
];

export default function ExplainabilityPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const searchUser = (id: string) => {
    setSelectedUser(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div id="explainability-header" className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Explainability Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Audit individual decisions using global and local SHAP/LIME explanations.</p>
          </div>
          <div id="engine-status" className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200">
             <Brain className="w-5 h-5 text-indigo-600" />
             <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Engine: SHAP-v2.1 Kernel</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Global Feature Importance */}
          <Card id="global-importance-card" className="lg:col-span-8 border-slate-200 shadow-sm bg-white overflow-hidden">
             <CardHeader className="py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-lg font-bold italic tracking-tight">Global Feature Importance</CardTitle>
                   <CardDescription>Top drivers for model predictions across the entire dataset.</CardDescription>
                </div>
                <Button id="btn-view-all-features" variant="ghost" size="sm" className="h-8 font-bold text-slate-400">View All 42 Features</Button>
             </CardHeader>
             <CardContent className="p-8">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={shapData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                         dataKey="feature" 
                         type="category" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                         width={140}
                      />
                      <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.feature}</p>
                                <p className="text-sm font-bold text-slate-900">Impact Score: <span className={(payload[0].value as number) > 0 ? "text-emerald-500" : "text-red-500"}>{payload[0].value}</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={24}>
                        {shapData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact > 0 ? "var(--primary)" : "#ef4444"} />
                        ))}
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-3">
                      <p className="text-xs text-emerald-800 leading-relaxed italic">
                        <strong className="block text-emerald-900 not-italic uppercase mb-1 tracking-widest text-[10px]">Positive Influencers</strong>
                        High <strong className="text-emerald-900 font-bold">Income</strong> and <strong className="text-emerald-900 font-bold">Credit Score</strong> contribute most to rejection avoidance.
                      </p>
                   </div>
                   <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
                      <p className="text-xs text-red-800 leading-relaxed italic">
                        <strong className="block text-red-900 not-italic uppercase mb-1 tracking-widest text-[10px]">Negative Influencers</strong>
                        Increasing <strong className="text-red-900 font-bold">Age</strong> shows a counter-intuitive negative correlation with loan approval.
                      </p>
                   </div>
                </div>
             </CardContent>
          </Card>

          {/* Right: Individual Auditor */}
          <div id="individual-auditor-column" className="lg:col-span-4 space-y-8">
             <Card id="decision-auditor-card" className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="py-6 border-b border-slate-50">
                   <CardTitle className="text-lg font-bold italic tracking-tight">Decision Auditor</CardTitle>
                   <CardDescription>Target a specific sample ID for deep audit.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                   <div id="search-container" className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        id="sample-search-input"
                        placeholder="Enter Sample UUID..." 
                        className="pl-10 h-10 border-slate-200 focus:ring-primary/20"
                        onKeyDown={(e) => e.key === "Enter" && searchUser("UUID-A482-K0")}
                      />
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest text-center">Press Enter to audit</p>
                   
                   {!selectedUser ? (
                      <div className="mt-12 text-center space-y-4 opacity-50 grayscale">
                        <User className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">Standing by for Audit Request</p>
                      </div>
                   ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 space-y-6"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold italic text-lg shadow-lg shadow-indigo-600/20">JD</div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-900">John Doe</h4>
                               <p className="text-xs text-slate-400 font-mono tracking-tighter">REF: {selectedUser}</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                               <Badge className="bg-red-500 text-white h-5 mb-1">REJECTED</Badge>
                               <span className="text-[10px] font-bold text-slate-400 italic">Confidence: 89%</span>
                            </div>
                         </div>
                         
                         <div className="space-y-3">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Zap className="w-3 h-3 text-amber-500" /> Local Contributions
                            </h5>
                            {[
                               { label: "Age", impact: -0.32, color: "bg-red-500" },
                               { label: "Zip Code", impact: -0.18, color: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" },
                               { label: "Credit Score", impact: +0.24, color: "bg-emerald-500" },
                            ].map((fea, i) => (
                               <div key={i} className="flex items-center justify-between text-xs font-bold p-2 hover:bg-slate-50 transition-colors rounded-lg">
                                  <span className="text-slate-600 font-mono">{fea.label}</span>
                                  <div className="flex items-center gap-3">
                                     <span className={fea.impact > 0 ? "text-emerald-500" : "text-red-500"}>{fea.impact > 0 ? "+" : ""}{fea.impact}</span>
                                     <div className={cn("w-2 h-2 rounded-full", fea.color)} />
                                  </div>
                               </div>
                            ))}
                         </div>
                         
                         <Button className="w-full font-bold h-10 shadow-lg shadow-primary/20">Analyze Counterfactuals</Button>
                      </motion.div>
                   )}
                </CardContent>
             </Card>

             <Card className="bg-indigo-900 border-none shadow-xl">
                <CardContent className="p-8">
                   <ShieldCheck className="w-10 h-10 text-amber-400 mb-6" />
                   <h3 className="text-xl font-bold text-white mb-3 italic tracking-tight">Fairness Check</h3>
                   <p className="text-indigo-200 text-xs leading-relaxed font-medium mb-6">
                     This specific prediction was influenced by <strong className="text-white">Zip Code</strong>, which has high demographic parity violations. 
                     Audit recommends human intervention.
                   </p>
                   <Button variant="outline" className="w-full border-white/20 text-white font-bold hover:bg-white/10 uppercase tracking-widest text-[10px]">
                      Trigger Manual Override
                   </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
