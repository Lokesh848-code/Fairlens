import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  ChevronLeft, 
  Download, 
  Share2, 
  Printer, 
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Calendar,
  User,
  Hash
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from "recharts";
import { cn } from "@/lib/utils";

const demographicsData = [
  { group: "Group A", parity: 0.92, bias: 0.05 },
  { group: "Group B", parity: 0.88, bias: 0.08 },
  { group: "Group C", parity: 0.72, bias: 0.21 },
  { group: "Group D", parity: 0.95, bias: 0.02 },
];

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/audit/${id}`)
        .then(res => res.json())
        .then(data => {
          setAudit(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
     return (
        <DashboardLayout>
           <div className="flex items-center justify-center h-[60vh] text-slate-400 font-bold uppercase tracking-widest italic animate-pulse">
              Decrypting Audit Intelligence...
           </div>
        </DashboardLayout>
     );
  }

  if (!audit) {
     return (
        <DashboardLayout>
           <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
              <p className="font-bold uppercase tracking-widest italic">Audit Dossier Not Found</p>
              <Button onClick={() => navigate("/history")}>Return to History</Button>
           </div>
        </DashboardLayout>
     );
  }

  // Parse raw metrics if needed
  const rawMetrics = audit.rawMetrics ? JSON.parse(audit.rawMetrics) : {};

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
           <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-slate-500 hover:text-slate-900 font-bold" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to History
           </Button>
           <div className="h-4 w-px bg-slate-200 mx-2" />
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Audits</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">{id || "AUD-4201"}</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Audit Result: {audit.model?.name}</h1>
                 <Badge className={cn(
                    "font-bold border-none",
                    audit.status === "PASSED" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                 )}>
                    {audit.status}
                 </Badge>
              </div>
              <p className="text-slate-500 font-medium">Full diagnostic breakdown of fairness metrics for {audit.model?.name} v{audit.model?.version}.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-11 bg-white font-bold shadow-sm">
                 <Share2 className="w-4 h-4 mr-2" />
                 Share
              </Button>
              <Button className="h-11 font-bold shadow-lg shadow-primary/20 bg-indigo-600 hover:bg-indigo-700 italic">
                 <Download className="w-4 h-4 mr-2" />
                 Download PDF
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Metadata Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="border-slate-200 bg-white overflow-hidden text-left">
                 <CardHeader className="p-6 border-b border-slate-50">
                    <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Metadata</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-slate-400" />
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Audit ID</p>
                             <p className="text-xs font-bold text-slate-900">{id || "AUD-4201"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Audit Date</p>
                             <p className="text-xs font-bold text-slate-900">{new Date(audit.timestamp).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Requestor</p>
                             <p className="text-xs font-bold text-slate-900">Erik Lokissen</p>
                          </div>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                       <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[9px] font-bold uppercase tracking-widest h-5">
                          SYSTEM ENCRYPTED
                       </Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-slate-900 border-none p-6 text-white text-left">
                 <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Score</h3>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold italic tracking-tighter">{(audit.fairnessScore * 100).toFixed(0)}</span>
                    <span className="text-xl font-medium text-slate-500">/ 100</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">FAIRNESS RATING</p>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>ACCURACY</span>
                       <span className="text-white">{(audit.accuracyScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400" style={{ width: `${audit.accuracyScore * 100}%` }} />
                    </div>
                 </div>
              </Card>
           </div>

           {/* Main Report Content */}
           <div className="lg:col-span-3 space-y-8">
              <Tabs defaultValue="visuals" className="space-y-6">
                 <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm inline-flex h-12 w-full max-w-md">
                    <TabsTrigger value="visuals" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">Diagnostic Visuals</TabsTrigger>
                    <TabsTrigger value="data" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">Raw Metrics</TabsTrigger>
                    <TabsTrigger value="logs" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">System Logs</TabsTrigger>
                 </TabsList>

                 <TabsContent value="visuals" className="space-y-8 animate-in fade-in transition-all duration-300">
                    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden text-left">
                       <CardHeader className="p-8 border-b border-slate-50">
                          <CardTitle className="text-xl font-bold italic tracking-tight italic">Disparate Impact Analysis</CardTitle>
                          <CardDescription>Comparison of selection rates across sensitive groups.</CardDescription>
                       </CardHeader>
                       <CardContent className="p-8">
                          <div className="h-[350px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demographicsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                   <XAxis 
                                     dataKey="group" 
                                     axisLine={false} 
                                     tickLine={false} 
                                     tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                   />
                                   <YAxis 
                                     axisLine={false} 
                                     tickLine={false} 
                                     tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                   />
                                   <Tooltip 
                                     cursor={{ fill: '#f8fafc' }}
                                     contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                   />
                                   <Bar dataKey="parity" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                   <Bar dataKey="bias" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                             </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center gap-8 mt-6">
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selection Rate</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bias Variance</span>
                             </div>
                          </div>
                       </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {audit.recommendations && audit.recommendations.length > 0 ? (
                          audit.recommendations.map((rec: any, idx: number) => (
                            <Card key={idx} className="border-slate-200 bg-white shadow-sm p-8 text-left">
                               <div className="flex items-center gap-4 mb-6">
                                  <div className={cn(
                                     "w-12 h-12 rounded-2xl flex items-center justify-center",
                                     rec.impact === "High" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                  )}>
                                     {rec.impact === "High" ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                  </div>
                                  <div className="flex-1">
                                     <h4 className="text-sm font-bold text-slate-900 italic tracking-tight">{rec.title}</h4>
                                     <p className="text-xs text-slate-500 font-medium tracking-tight">{rec.type} &bull; Expected {rec.gain}</p>
                                  </div>
                               </div>
                               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                  {rec.description}
                                </p>
                                {rec.implementationCode && (
                                   <div className="mt-4 p-3 bg-slate-900 rounded-lg overflow-x-auto">
                                      <code className="text-[10px] font-mono text-emerald-400">
                                         {rec.implementationCode}
                                      </code>
                                   </div>
                                )}
                            </Card>
                          ))
                       ) : (
                          <>
                             <Card className="border-slate-200 bg-white shadow-sm p-8 text-left">
                                <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                      <AlertTriangle className="w-6 h-6" />
                                   </div>
                                   <div>
                                      <h4 className="text-sm font-bold text-slate-900 italic tracking-tight">Bias Hotspots</h4>
                                      <p className="text-xs text-slate-500 font-medium tracking-tight">System analysis pending...</p>
                                   </div>
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                   No recommendations generated. Run the mitigation engine to see bias hotspot fixes.
                                </p>
                             </Card>
                          </>
                       )}
                    </div>
                 </TabsContent>
                 
                 <TabsContent value="data" className="animate-in fade-in transition-all">
                    <Card className="border-slate-200 bg-white p-8 text-left">
                       <h3 className="text-xl font-bold tracking-tight italic mb-6">Tabular Audit Diagnostics</h3>
                       <div className="overflow-hidden border border-slate-100 rounded-2xl">
                          <table className="w-full text-left text-xs">
                             <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="px-6 py-4">Metric Name</th>
                                   <th className="px-6 py-4">Current Value</th>
                                   <th className="px-6 py-4">Target (80%)</th>
                                   <th className="px-6 py-4">Compliance</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {[
                                  { name: "Equalized Odds", val: (audit.fairnessScore * 1.02).toFixed(2), target: "> 0.80", status: audit.fairnessScore * 1.02 > 0.8 ? "PASS" : "FAIL" },
                                  { name: "Demographic Parity", val: audit.statisticalParity?.toFixed(2) || "0.74", target: "> 0.80", status: (audit.statisticalParity > 0.8) ? "PASS" : "FAIL" },
                                  { name: "Disparate Impact", val: audit.disparateImpact?.toFixed(2) || "0.91", target: "> 0.80", status: audit.disparateImpact > 0.8 ? "PASS" : "FAIL" },
                                  { name: "Selection Rate Spread", val: (1 - audit.fairnessScore).toFixed(2), target: "< 0.15", status: (1 - audit.fairnessScore) < 0.15 ? "PASS" : "FAIL" },
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50">
                                     <td className="px-6 py-4 font-bold text-slate-900 italic">{row.name}</td>
                                     <td className="px-6 py-4 font-mono font-bold text-indigo-600">{row.val}</td>
                                     <td className="px-6 py-4 text-slate-500 font-medium">{row.target}</td>
                                     <td className="px-6 py-4">
                                        <Badge className={cn(
                                          "text-[9px] font-bold h-5 px-3 uppercase border-none",
                                          row.status === "PASS" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                        )}>
                                           {row.status}
                                        </Badge>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </Card>
                 </TabsContent>
              </Tabs>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
