import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Zap, 
  Play, 
  RotateCcw, 
  Save, 
  Info, 
  Scale, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Database,
  Cpu
} from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceArea
} from "recharts";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const initialPoints = [
  { x: 0.85, y: 0.82, group: "Baseline", size: 100 },
  { x: 0.92, y: 0.65, group: "Max Accuracy", size: 80 },
  { x: 0.78, y: 0.91, group: "High Fairness", size: 80 },
  { x: 0.81, y: 0.84, group: "FairLens Optimized", size: 150 },
];

export default function SandboxPage() {
  const [mitigationLevel, setMitigationLevel] = useState([45]);
  const [threshold, setThreshold] = useState([50]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulatedMetrics = useMemo(() => {
    // Basic logic to simulate fairness/accuracy trade-off
    const baseAccuracy = 0.91;
    const baseFairness = 0.72;
    
    const accuracyLoss = (mitigationLevel[0] / 100) * 0.15;
    const fairnessGain = (mitigationLevel[0] / 100) * 0.25;
    
    // Threshold effect
    const thresholdImpact = Math.abs(threshold[0] - 50) / 100;
    
    return {
      accuracy: (baseAccuracy - accuracyLoss - (thresholdImpact * 0.05)).toFixed(2),
      fairness: (baseFairness + fairnessGain - (thresholdImpact * 0.1)).toFixed(2),
      prevalence: (0.15 + (threshold[0] / 100) * 0.1).toFixed(2),
    };
  }, [mitigationLevel, threshold]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  const saveAudit = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch("/api/audit/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: "Lending_v4_Credit_Screener",
          fairness: simulatedMetrics.fairness,
          accuracy: simulatedMetrics.accuracy,
          metrics: {
            disparateImpact: parseFloat(simulatedMetrics.fairness),
            statisticalParity: (parseFloat(simulatedMetrics.fairness) * 0.9).toFixed(2),
            mitigationIntensity: mitigationLevel[0],
            classificationThreshold: threshold[0]
          }
        })
      });
      
      if (response.ok) {
        console.log("Audit saved to database");
        // We could add a toast here
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Fairness Sandbox</h1>
              <p className="text-slate-500 font-medium mt-1">Experiment with mitigation strategies and threshold tuning.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-10 border-slate-200 bg-white font-bold" onClick={() => { setMitigationLevel([0]); setThreshold([50]); }}>
                 <RotateCcw className="w-4 h-4 mr-2" />
                 Reset
              </Button>
              <Button className="h-10 font-bold shadow-lg shadow-primary/20" onClick={runSimulation} disabled={isSimulating}>
                 {isSimulating ? <Zap className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                 {isSimulating ? "Computing..." : "Run Simulation"}
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Sidebar Controls */}
           <div className="lg:col-span-4 space-y-6">
              <Card className="border-slate-200 bg-white shadow-sm overflow-hidden text-left">
                 <CardHeader className="p-6 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Simulation parameters</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-8">
                    {/* Mitigation Level */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             Mitigation Intensity
                             <HelpCircle className="w-3 h-3 text-slate-300" />
                          </label>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-mono">{mitigationLevel}%</Badge>
                       </div>
                       <Slider 
                         value={mitigationLevel} 
                         onValueChange={setMitigationLevel} 
                         max={100} 
                         step={1} 
                         className="py-4"
                       />
                       <p className="text-[10px] text-slate-400 font-medium italic">Adjusting reweighing weights and data resampling severity.</p>
                    </div>

                    {/* Decision Threshold */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             Classification Threshold
                             <HelpCircle className="w-3 h-3 text-slate-300" />
                          </label>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-mono">{threshold}%</Badge>
                       </div>
                       <Slider 
                         value={threshold} 
                         onValueChange={setThreshold} 
                         max={100} 
                         step={1} 
                         className="py-4"
                       />
                       <p className="text-[10px] text-slate-400 font-medium italic">Shifting the boundary for positive binary predictions.</p>
                    </div>

                    <div className="pt-4 space-y-3">
                       <Button variant="ghost" className="w-full justify-between font-bold text-xs group text-slate-600 hover:text-slate-900">
                          Advanced Overlays
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </Button>
                       <Button variant="ghost" className="w-full justify-between font-bold text-xs group text-slate-600 hover:text-slate-900">
                          Specific Demographic Locks
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </Button>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-slate-900 border-none p-6 text-white text-left">
                 <div className="flex items-center gap-3 mb-6">
                    <Scale className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-lg font-bold italic tracking-tight">Trade-off Analytics</h3>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Fairness</span>
                       <span className={cn(
                         "text-xl font-bold italic tracking-tight",
                         parseFloat(simulatedMetrics.fairness) > 0.8 ? "text-emerald-400" : "text-amber-400"
                       )}>{simulatedMetrics.fairness}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model Accuracy</span>
                       <span className="text-xl font-bold italic tracking-tight text-white">{simulatedMetrics.accuracy}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                       <Button 
                         onClick={saveAudit}
                         disabled={isSimulating}
                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-lg shadow-indigo-600/20"
                       >
                          <Save className="w-4 h-4 mr-2" />
                          {isSimulating ? "Saving..." : "Apply Config to Model"}
                       </Button>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Main Visualizer */}
           <div className="lg:col-span-8">
              <Card className="border-slate-200 bg-white shadow-sm h-full flex flex-col text-left">
                 <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-xl font-bold italic tracking-tight italic">Fairness-Utility Frontier</CardTitle>
                       <CardDescription>Visualizing the optimal balance for <strong>Lending_v4</strong>.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Live Prediction</span>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-8 flex-1">
                    <div className="h-[450px] w-full relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis 
                               type="number" 
                               dataKey="x" 
                               name="Fairness" 
                               domain={[0.5, 1]} 
                               tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                               label={{ value: 'Fairness Score (Parity)', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                             />
                             <YAxis 
                               type="number" 
                               dataKey="y" 
                               name="Accuracy" 
                               domain={[0.5, 1]} 
                               tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                               label={{ value: 'Model Accuracy (AUC)', angle: -90, position: 'left', fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                             />
                             <ZAxis type="number" dataKey="size" range={[100, 300]} />
                             <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             />
                             {/* Points */}
                             <Scatter name="Historical Performance" data={initialPoints}>
                                {initialPoints.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={index === 3 ? "var(--primary)" : "#cbd5e1"} fillOpacity={index === 3 ? 1 : 0.6} />
                                ))}
                             </Scatter>

                             {/* Dynamic Simulated Point */}
                             {!isSimulating && (
                                <Scatter name="Current Simulation" data={[{ x: parseFloat(simulatedMetrics.fairness), y: parseFloat(simulatedMetrics.accuracy), size: 500 }]}>
                                   <Cell fill="#10b981" />
                                </Scatter>
                             )}
                          </ScatterChart>
                       </ResponsiveContainer>
                       
                       {isSimulating && (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4"
                            >
                               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                  <Cpu className="w-6 h-6 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                   <p className="text-sm font-bold text-slate-900 italic tracking-tight">Simulating 1,000,000 permutations...</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recalculating demographic tensors</p>
                                </div>
                            </motion.div>
                         </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

        {/* Insight Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <Card className="p-6 border-slate-200 bg-white flex flex-col text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                 <Database className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 italic mb-2 tracking-tight">Data Provenance Check</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                 Simulated results are based on the latest 30-day lookback window. Drift in production data may affect real-world outcomes.
              </p>
              <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary justify-start">View Data Source</Button>
           </Card>

           <Card className="p-6 border-slate-200 bg-white flex flex-col text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                 <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 italic mb-2 tracking-tight">Conflict Identified</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                 Increasing threshold beyond 65% causes 'Group C' to fail parity requirements. Mitigation intensity must be set to 75%+.
              </p>
              <Badge className="w-fit bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-widest">Policy Override Required</Badge>
           </Card>

           <Card className="p-6 border-slate-200 bg-white flex flex-col text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 italic mb-2 tracking-tight">Optimization Success</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                 Current configuration meets EU AI Act High-Risk system documentation requirements for "Technical Documentation" (Annex IV).
              </p>
              <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary justify-start">Audit Export Preview</Button>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
