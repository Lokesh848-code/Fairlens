import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, TrendingUp, AlertTriangle } from "lucide-react";

export function AuditPreview() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Dashboard Left Column: Primary Metrics */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight italic">Audit Overview</h2>
                <p className="text-slate-500 font-medium mt-1">Model: Consumer Credit Scoring Engine • Last Audit: 14 mins ago</p>
              </div>
              <div className="hidden sm:flex gap-3">
                <Button variant="outline" size="sm" className="bg-white">Export Report</Button>
                <Button size="sm">Run New Audit</Button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fairness Score</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-emerald-600">92</span>
                    <span className="text-slate-400 text-sm font-medium">/ 100</span>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[92%]" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disparate Impact</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">0.84</span>
                    <span className="text-emerald-500 text-xs font-bold">↑ +0.02</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 font-medium">Industry Benchmark: &gt; 0.80 (Pass)</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prediction Drift</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-amber-500">2.4%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 font-medium">Stability: Moderate (Low Risk)</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Visualization Card */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-bold text-slate-900">Demographic Parity Analysis</CardTitle>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Protected Group
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-200" /> Reference Group
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex h-48 items-end justify-between gap-12 border-b border-slate-100 pb-6">
                  {[
                    { label: "Gender", ref: 100, prot: 88 },
                    { label: "Ethnicity", ref: 94, prot: 72 },
                    { label: "Age Range", ref: 82, prot: 78 },
                    { label: "Income", ref: 90, prot: 89 }
                  ].map((group, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full flex justify-center items-end gap-2 h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${group.ref}%` }}
                          className="w-10 md:w-16 bg-slate-100 rounded-t-sm"
                        />
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${group.prot}%` }}
                          className="w-10 md:w-16 bg-primary rounded-t-sm"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{group.label}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium italic">
                    SHAP Importance: <strong className="text-slate-900">'Credit Score'</strong> and <strong className="text-slate-900">'Income'</strong> account for 64% of prediction weights.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs font-bold">View Explainability Report →</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Insights */}
          <div className="md:col-span-4 h-full">
            <Card className="bg-slate-900 text-white border-none shadow-xl h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-amber-400 rounded text-slate-900">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-lg font-bold tracking-tight">Bias Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-widest">High Risk</span>
                  <h4 className="text-sm font-bold mt-1">Proxy Variable Detected</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    'Zip Code' shows 0.82 correlation with sensitive attribute 'Ethnicity'. Consider removing or anonymizing.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest">Optimization</span>
                  <h4 className="text-sm font-bold mt-1">Equalized Odds Alignment</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                    Model performs better on Group A than Group B for false-negative rates.
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <div className="bg-primary/20 p-5 rounded-2xl border border-primary/20 bg-indigo-500/10">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                      AI Recommendation
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Applying <strong className="text-white">Pre-processing Reweighing</strong> could improve Demographic Parity by 12% with minimal accuracy loss.
                    </p>
                    <Button className="w-full mt-4 h-10 font-bold bg-primary hover:bg-primary/90 transition-all border-none">
                      Apply Automated Fix
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
