import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  Database,
  ArrowRight,
  Info,
  ScanSearch,
  Briefcase,
  Landmark,
  HeartPulse,
  GraduationCap,
  Sparkles,
  BarChart3,
  Download,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParsedColumn {
  name: string;
  type: string;
  sample: string;
}

const sampleIndustries = [
  { id: "hiring", name: "Hiring", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "bank", name: "Banking", icon: Landmark, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "health", name: "Healthcare", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "edu", name: "Education", icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-50" },
];

type Step = "upload" | "mapping" | "analyzing" | "result";

export default function DatasetAuditPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [parsedColumns, setParsedColumns] = useState<ParsedColumn[]>([]);
  const [csvContent, setCsvContent] = useState<string>("");
  const navigate = useNavigate();

  // Parse CSV headers when file is selected
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
        const lines = content.split(/\r?\n/).filter(l => l.trim());
        if (lines.length > 0) {
          const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
          const secondRow = lines[1]?.split(",").map(v => v.trim().replace(/^["']|["']$/g, "")) || [];
          
          const cols: ParsedColumn[] = headers.map((name, idx) => {
            const sample = secondRow[idx] || "";
            const numVal = parseFloat(sample);
            const type = !isNaN(numVal) && sample !== "" ? "Numerical" : 
                        ["0", "1", "true", "false", "yes", "no"].includes(sample.toLowerCase()) ? "Boolean" : "Categorical";
            return { name, type, sample };
          });
          setParsedColumns(cols);
        }
      };
      reader.readAsText(file.slice(0, 5120)); // Read first 5KB for preview
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setParsedColumns([]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    
    setStep("analyzing");
    
    try {
      // Read a sample of the file (first 10KB)
      const reader = new FileReader();
      const sampleContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file.slice(0, 10240)); // Read first 10KB
      });

      const response = await fetch("/api/analyze-dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          sampleData: sampleContent
        })
      });

      if (!response.ok) throw new Error("Analysis failed");
      
      const data = await response.json();
      setAnalysisResult(data);
      setStep("result");
      toast.success("AI Bias Audit Complete");
    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error("Failed to analyze dataset. Please try again.");
      setStep("mapping");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
          {[
            { id: "upload", label: "Upload CSV" },
            { id: "mapping", label: "Map Attributes" },
            { id: "analyzing", label: "AI Analysis" },
            { id: "result", label: "Audit Report" }
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                step === s.id ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                (i < ["upload", "mapping", "analyzing", "result"].indexOf(step) ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200")
              )}>
                {i < ["upload", "mapping", "analyzing", "result"].indexOf(step) ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(step === s.id ? "text-slate-900" : "")}>{s.label}</span>
              {i < 3 && <div className="hidden sm:block w-8 border-t border-slate-200 mx-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              id="step-upload-container"
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card id="upload-card" className="border-2 border-dashed border-slate-200 bg-white shadow-sm hover:border-primary/50 transition-colors">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Database className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 italic">Select Dataset</h2>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">Upload your training dataset or pick a industry template for audit.</p>
                  
                  <div className="flex flex-col items-center justify-center gap-2 mb-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Start with a industry sample</p>
                    <div className="flex gap-4 justify-center">
                       {sampleIndustries.map((ind) => (
                         <a 
                           key={ind.id}
                           href={`/api/samples/${ind.id}`}
                           download
                           className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 hover:shadow-sm transition-all cursor-pointer group"
                         >
                           <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", ind.bg, ind.color)}>
                              <ind.icon className="w-5 h-5" />
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{ind.name}</span>
                         </a>
                       ))}
                    </div>
                  </div>

                  {!file ? (
                    <div 
                      className={cn(
                        "relative border-2 border-slate-100 rounded-2xl p-10 bg-slate-50/50 transition-all cursor-pointer",
                        isDragActive ? "border-primary bg-primary/5" : ""
                      )}
                      onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                      onDragLeave={() => setIsDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          setFile(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById("fileInput")?.click()}
                    >
                      <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json,.parquet" />
                      <Upload className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-600">Drag & drop or <span className="text-primary underline">browse files</span></p>
                      <p className="text-xs text-slate-400 mt-2">Max file size: 250MB</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center">
                          <File className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; CSV Format</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <Button 
                    className="mt-8 px-8 h-12 font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                    disabled={!file}
                    onClick={() => setStep("mapping")}
                  >
                    Proceed to Column Mapping
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "mapping" && (
            <motion.div
              id="step-mapping-container"
              key="mapping"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <Card id="mapping-card" className="border-slate-200 bg-white shadow-lg overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-8">
                  <CardTitle className="text-2xl font-bold tracking-tight italic flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Sensitive Attribute Mapping
                  </CardTitle>
                  <CardDescription>Identify the columns in your data that represent protected attributes (Race, Gender, Age, etc.)</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Detected Columns ({parsedColumns.length})</Label>
                          <Badge variant="outline" className="text-xs">{file?.name}</Badge>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto space-y-2">
                          {parsedColumns.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">Loading columns...</div>
                          ) : (
                            parsedColumns.map((col, idx) => {
                              const isSensitive = /gender|race|ethnicity|age|sex|zip|postal|location/i.test(col.name);
                              const isOutcome = /hired|approved|admitted|outcome|decision|status|label|target/i.test(col.name);
                              const defaultRole = isSensitive ? "Protected Attribute" : isOutcome ? "Outcome Variable" : "Feature";
                              
                              return (
                                <div key={idx} className={cn(
                                  "flex items-center justify-between p-3 rounded-xl border bg-slate-50/50",
                                  isSensitive ? "border-amber-200 bg-amber-50/30" : isOutcome ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"
                                )}>
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                                      col.type === "Numerical" ? "bg-blue-100 text-blue-600" : 
                                      col.type === "Boolean" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"
                                    )}>
                                      {col.type[0]}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900 font-mono">{col.name}</p>
                                      <span className="text-[10px] uppercase font-bold text-slate-400">{col.type} &bull; Sample: {col.sample || "N/A"}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isSensitive && <Badge className="bg-amber-100 text-amber-700 text-[9px]">Sensitive</Badge>}
                                    {isOutcome && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">Outcome</Badge>}
                                    <select className="text-xs font-bold bg-white border border-slate-200 rounded-lg h-9 px-3">
                                      <option>{defaultRole}</option>
                                      <option>Protected Attribute</option>
                                      <option>Feature</option>
                                      <option>Outcome Variable</option>
                                      <option>Ignore</option>
                                    </select>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-indigo-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <ScanSearch className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold mb-4 italic flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                          AI Recommendations
                        </h4>
                        <div className="space-y-4 flex-1">
                          <div className="p-3 bg-white/10 rounded-lg border border-white/10">
                            <p className="text-xs font-bold text-amber-400 mb-1">PROXY DETECTED</p>
                            <p className="text-xs text-slate-300">Column <strong className="text-white">'Zip Code'</strong> might act as a proxy for <strong className="text-white">Ethnicity</strong>. Consider mapping it as sensitive.</p>
                          </div>
                          <div className="p-3 bg-white/10 rounded-lg border border-white/10">
                            <p className="text-xs font-bold text-indigo-300 mb-1">IMBALANCE ALERT</p>
                            <p className="text-xs text-slate-300">Target feature <strong className="text-white">'Loan Status'</strong> shows 82% skew. Synthetic balancing will be applied.</p>
                          </div>
                        </div>
                        <div className="mt-8">
                          <div className="bg-emerald-500/20 p-3 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-100">Optimized for EU AI Act compliance</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" className="h-12 px-8 font-bold" onClick={() => setStep("upload")}>
                        Back
                      </Button>
                      <Button className="flex-1 h-12 font-bold shadow-xl shadow-primary/20" onClick={startAnalysis}>
                        Begin Bias Audit
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              id="step-analyzing-container"
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 italic">Scanning Dataset...</h2>
              <p className="text-slate-500 animate-pulse font-medium">Running statistical parity tests and causal diagrams...</p>
              
              <div className="mt-12 max-w-sm mx-auto space-y-3">
                {[
                  "Checking demographic parity...",
                  "Identifying proxy features...",
                  "Calculating Disparate Impact Ratio...",
                  "Verifying Label Bias..."
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    {task}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              id="step-result-container"
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card id="result-card" className="border-slate-200 bg-white shadow-lg overflow-hidden">
                <CardHeader className={cn(
                  "border-b p-8 flex flex-row justify-between items-center",
                  analysisResult?.fairnessScore >= 80 ? "bg-emerald-50 border-emerald-100" : 
                  analysisResult?.fairnessScore >= 60 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"
                )}>
                  <div>
                    <CardTitle className={cn(
                      "text-2xl font-bold tracking-tight italic flex items-center gap-2",
                      analysisResult?.fairnessScore >= 80 ? "text-emerald-900" : 
                      analysisResult?.fairnessScore >= 60 ? "text-amber-900" : "text-red-900"
                    )}>
                       <CheckCircle2 className={cn(
                         "w-6 h-6",
                         analysisResult?.fairnessScore >= 80 ? "text-emerald-600" : 
                         analysisResult?.fairnessScore >= 60 ? "text-amber-600" : "text-red-600"
                       )} />
                       Audit Complete
                    </CardTitle>
                    <CardDescription className={cn(
                      "font-medium opacity-80",
                      analysisResult?.fairnessScore >= 80 ? "text-emerald-700" : 
                      analysisResult?.fairnessScore >= 60 ? "text-amber-700" : "text-red-700"
                    )}>
                      {analysisResult?.fairnessScore >= 80 ? "Fairness metrics within acceptable thresholds" : 
                       analysisResult?.fairnessScore >= 60 ? "Potential bias detected - review recommended" : "Critical bias issues detected"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-bold" onClick={() => navigate("/reports")}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Full Analysis
                    </Button>
                    <Button size="sm" className="font-bold" onClick={() => navigate("/recommendations")}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Mitigations
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fairness Score</span>
                      <div className={cn(
                        "text-2xl font-bold mt-1 italic",
                        analysisResult?.fairnessScore >= 80 ? "text-emerald-600" : 
                        analysisResult?.fairnessScore >= 60 ? "text-amber-500" : "text-red-500"
                      )}>{analysisResult?.fairnessScore ?? 0}/100</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disparate Impact</span>
                      <div className={cn(
                        "text-2xl font-bold mt-1 italic",
                        analysisResult?.disparateImpact >= 0.8 ? "text-emerald-600" : "text-red-500"
                      )}>{(analysisResult?.disparateImpact ?? 0).toFixed(3)}</div>
                      <span className="text-[9px] text-slate-400">threshold: 0.80</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bias Issues</span>
                      <div className="text-2xl font-bold text-red-500 mt-1 italic">{analysisResult?.detectedBiases?.length ?? 0}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proxy Risks</span>
                      <div className="text-2xl font-bold text-amber-500 mt-1 italic">{analysisResult?.proxyRisks?.length ?? 0}</div>
                    </div>
                  </div>
                  
                  {/* Detailed Summary */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 border-l-4 border-l-indigo-600 text-left mb-8">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                      <ScanSearch className="w-4 h-4 text-indigo-600" />
                      Statistical Analysis Summary
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {analysisResult?.summary || "Analysis complete."}
                    </p>
                    {analysisResult?.statisticalParity !== undefined && (
                      <div className="mt-3 flex gap-4 text-xs">
                        <span className="font-medium text-slate-500">Statistical Parity: <span className={analysisResult.statisticalParity >= 0.8 ? "text-emerald-600" : "text-amber-600"}>{(analysisResult.statisticalParity).toFixed(3)}</span></span>
                        <span className="font-medium text-slate-500">Equalized Odds: <span className="text-slate-700">{(analysisResult.equalizedOdds).toFixed(3)}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Group Analysis Table */}
                  {analysisResult?.groupAnalysis && Object.keys(analysisResult.groupAnalysis).length > 0 && (
                    <div className="mb-8 text-left">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Group Selection Rates by Protected Attribute</h4>
                      <div className="space-y-4">
                        {Object.entries(analysisResult.groupAnalysis).map(([attr, groups]: [string, any]) => (
                          <div key={attr} className="border border-slate-100 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 uppercase">{attr}</div>
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50/50">
                                <tr>
                                  <th className="text-left px-4 py-2 text-[10px] uppercase text-slate-400">Group</th>
                                  <th className="text-right px-4 py-2 text-[10px] uppercase text-slate-400">Selection Rate</th>
                                  <th className="text-right px-4 py-2 text-[10px] uppercase text-slate-400">Count</th>
                                </tr>
                              </thead>
                              <tbody>
                                {groups.map((g: any, i: number) => (
                                  <tr key={i} className="border-t border-slate-50">
                                    <td className="px-4 py-2 font-medium text-slate-900">{g.group}</td>
                                    <td className={cn(
                                      "px-4 py-2 text-right font-bold",
                                      g.selectionRate >= 0.8 ? "text-emerald-600" : g.selectionRate >= 0.6 ? "text-amber-500" : "text-red-500"
                                    )}>{(g.selectionRate * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-2 text-right text-slate-500">{g.count}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proxy Risks Detail */}
                  {analysisResult?.proxyRiskDetails && analysisResult.proxyRiskDetails.length > 0 && (
                    <div className="mb-8 text-left">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Proxy Variable Risks
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.proxyRiskDetails.map((risk: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-amber-900">{risk.column} → {risk.correlatedWith}</span>
                              <Badge className="bg-amber-100 text-amber-700 text-[10px]">{(risk.correlationScore * 100).toFixed(0)}% correlation</Badge>
                            </div>
                            <p className="text-xs text-amber-700">{risk.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bias Signals */}
                  {analysisResult?.detectedBiases && analysisResult.detectedBiases.length > 0 && (
                     <div className="mb-8 text-left">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detected Bias Signals</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {analysisResult.detectedBiases.map((bias: string, idx: number) => (
                             <div key={idx} className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs font-bold text-red-900 italic tracking-tight">{bias}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                  {/* Recommendations */}
                  {analysisResult?.recommendations && analysisResult.recommendations.length > 0 && (
                    <div className="mb-8 text-left">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recommended Actions</h4>
                      <div className="space-y-3">
                        {analysisResult.recommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-indigo-900 italic">{rec.title}</span>
                                  <Badge className={cn(
                                    "text-[9px]",
                                    rec.impact === "High" ? "bg-red-100 text-red-700" : 
                                    rec.impact === "Medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                  )}>{rec.impact} Impact</Badge>
                                  <Badge variant="outline" className="text-[9px] bg-white">{rec.type}</Badge>
                                </div>
                                <p className="text-xs text-indigo-700">{rec.description}</p>
                                <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">Expected: {rec.gain}</span>
                              </div>
                              <Button size="sm" variant="ghost" className="shrink-0" onClick={() => navigate("/recommendations")}>
                                Apply
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                     <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => { setStep("upload"); setFile(null); setParsedColumns([]); setAnalysisResult(null); }}>
                       <Download className="w-4 h-4 mr-2" />
                       Audit Different Dataset
                     </Button>
                     <Button className="flex-1 h-12 font-bold shadow-lg shadow-primary/20" onClick={() => navigate("/history")}>
                       <Database className="w-4 h-4 mr-2" />
                       View Audit History
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
