import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ScanSearch, 
  ChevronRight, 
  ShieldCheck, 
  Target, 
  Scale, 
  BarChart3, 
  Info,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Brain,
  ShieldAlert
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis
} from "recharts";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const demographicData = [
  { group: "Age 18-24", selection: 0.12, tpr: 0.85, fpr: 0.15 },
  { group: "Age 25-44", selection: 0.18, tpr: 0.92, fpr: 0.08 },
  { group: "Age 45-64", selection: 0.15, tpr: 0.90, fpr: 0.10 },
  { group: "Age 65+", selection: 0.08, tpr: 0.78, fpr: 0.22 },
];

const fairnessMetrics = [
  { subject: 'Demographic Parity', A: 120, B: 110, fullMark: 150 },
  { subject: 'Equal Opportunity', A: 98, B: 130, fullMark: 150 },
  { subject: 'Equalized Odds', A: 86, B: 130, fullMark: 150 },
  { subject: 'Disparate Impact', A: 99, B: 100, fullMark: 150 },
  { subject: 'Privacy Compliance', A: 85, B: 90, fullMark: 150 },
  { subject: 'Model Stability', A: 65, B: 85, fullMark: 150 },
];

export default function ModelEvaluationPage() {
  const [viewState, setViewState] = useState<"initial" | "processing" | "results">("initial");

  const runEvaluation = () => {
    setViewState("processing");
    setTimeout(() => {
      setViewState("results");
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div id="evaluation-header" className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Model Fairness Audit</h1>
            <p className="text-slate-500 font-medium mt-1">Audit predictive parity and error rates across diverse groups.</p>
          </div>
          {viewState === "results" && (
            <div id="results-actions" className="flex gap-2">
              <Button id="btn-recalibrate" variant="outline" className="h-10 bg-white font-bold">Recalibrate Model</Button>
              <Button id="btn-generate-cert" className="h-10 font-bold shadow-lg shadow-primary/20">Generate PDF Certificate</Button>
            </div>
          )}
        </div>

        {viewState === "initial" && (
          <div id="config-step" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card id="model-selection-card" className="border-2 border-primary/20 bg-white shadow-xl p-8 hover:border-primary transition-all group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 italic tracking-tight">Active Model Selection</h2>
              <p className="text-slate-500 mb-8 font-medium">Connect to your hosted ML model via REST endpoint or upload a serialized weights file (Pickle, Joblib, ONNX).</p>
              
              <div id="model-list" className="space-y-4 mb-8 text-sm font-bold text-slate-600">
                <div id="model-prod-v4" className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Lending_Model_Production_v4.2</span>
                  </div>
                  <Badge className="bg-primary text-white">SELECTED</Badge>
                </div>
                <div id="btn-connect-endpoint" className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3 text-slate-400 font-medium">
                   <PlusIcon className="w-4 h-4" /> Connect New Endpoint
                </div>
              </div>
              
              <Button id="btn-init-audit" className="w-full h-12 font-bold shadow-lg shadow-primary/20" onClick={runEvaluation}>
                Initialize Fairness Audit
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200 bg-white shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500" />
                  Audit Parameters
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Protected Attribute</span>
                    <Badge variant="secondary" className="font-bold">Age, Gender, Ethnicity</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-medium">Privileged Group</span>
                     <Badge variant="secondary" className="font-bold">Male, 35-44</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-4">
                    <span className="text-slate-500 font-medium italic">Legal Compliance Check</span>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                       <ShieldCheck className="w-4 h-4" /> EU AI ACT
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-10">
                   <Target className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-bold mb-4 italic tracking-tight">Standard Enforcement</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                  FairLens AI automatically enforces the "Four-Fifths Rule" and Equalized Odds thresholds during the evaluation process.
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400">Section 508</div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400">GDPR Art. 22</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewState === "processing" && (
          <div className="text-center py-24">
             <div className="relative inline-block mb-12">
                <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                   >
                     <ScanSearch className="w-12 h-12 text-primary" />
                   </motion.div>
                </div>
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-4 italic tracking-tight">Simulating Counterfactuals...</h2>
             <p className="text-slate-500 max-w-sm mx-auto font-medium">Running 50,000 synthetic permutations to test model resilience and parity drift.</p>
          </div>
        )}

        {viewState === "results" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Overall Fairness", value: "82%", icon: Scale, color: "text-amber-500", status: "Sub-Optimal" },
                { label: "Predictive Equality", value: "94%", icon: Target, color: "text-emerald-500", status: "Optimal" },
                { label: "Disparate Impact", value: "0.72", icon: AlertTriangle, color: "text-red-500", status: "Violation" },
                { label: "Model Quality", value: "88%", icon: FileCheck, color: "text-indigo-500", status: "High" },
              ].map((m, i) => (
                <Card key={i} className="border-slate-200 shadow-sm bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                       <Badge variant="outline" className={cn("text-[8px] font-bold py-0 h-4 uppercase tracking-tighter", m.color)}>{m.status}</Badge>
                    </div>
                    <div className={cn("text-3xl font-bold tracking-tight italic", m.color)}>{m.value}</div>
                    <div className="mt-4 h-1 w-full bg-slate-100 rounded-full">
                       <div className={cn("h-full rounded-full transition-all duration-1000", m.color.replace('text-', 'bg-'))} style={{ width: m.value.includes('.') ? "72%" : m.value }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Parity Graph */}
              <Card className="lg:col-span-8 border-slate-200 shadow-sm bg-white overflow-hidden">
                <Tabs defaultValue="demographic" className="w-full">
                  <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold italic tracking-tight">Statistical Parity Analysis</CardTitle>
                    </div>
                    <TabsList className="bg-slate-200/50 border border-slate-200 h-9 p-1">
                      <TabsTrigger value="demographic" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Selection Rate</TabsTrigger>
                      <TabsTrigger value="error" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Error Rates</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent className="p-8">
                    <TabsContent value="demographic" className="m-0 h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demographicData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                          <Tooltip 
                             cursor={{ fill: '#f8fafc' }}
                             contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                          <Bar dataKey="selection" name="Positive Outcome Rate" fill="var(--primary)" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="error" className="m-0 h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demographicData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                          <Tooltip cursor={{ fill: '#f8fafc' }} />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                          <Bar dataKey="tpr" name="True Positive Rate" fill="#10b981" barSize={30} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="fpr" name="False Positive Rate" fill="#ef4444" barSize={30} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>

              {/* Radar Chart */}
              <Card className="lg:col-span-4 border-slate-200 shadow-sm bg-white flex flex-col">
                <CardHeader className="py-6 border-b border-slate-50">
                   <CardTitle className="text-lg font-bold italic tracking-tight">Fairness Portrait</CardTitle>
                   <CardDescription>Multi-dimensional ethical alignment.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-center">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={fairnessMetrics}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name="Model A" dataKey="B" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                       </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                     <div className="p-4 bg-slate-900 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                           Overall Equilibrium
                           <span className="text-white">82%</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400 w-[82%]" />
                        </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Summary Banner */}
            <div className="p-8 rounded-3xl bg-indigo-900 text-white relative flex flex-col lg:flex-row gap-8 items-center border border-indigo-700 shadow-2xl">
              <div className="shrink-0 p-4 bg-white/10 rounded-3xl border border-white/20">
                 <ShieldAlert className="w-12 h-12 text-amber-400" />
              </div>
              <div className="flex-1 space-y-2 text-center lg:text-left">
                 <h3 className="text-2xl font-bold italic tracking-tight">Significant Bias Detected in Age Subgroups</h3>
                 <p className="text-indigo-200 font-medium leading-relaxed">
                   The model exhibits <strong className="text-white">statistical parity gap of 1.84x</strong> for Age 65+. 
                   This violates the "Golden Rule of Parity" and exposes your organization to regulatory high-risk status under the 2024 AI Ethics guidelines.
                 </p>
              </div>
              <div className="shrink-0 flex gap-4">
                 <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 h-12 rounded-xl">Mitigate Now</Button>
                 <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl italic">Explain Why →</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
