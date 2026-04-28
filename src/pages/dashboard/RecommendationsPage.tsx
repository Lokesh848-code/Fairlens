import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Settings2, 
  ChevronRight, 
  ArrowRight,
  Database,
  Users,
  Scale,
  BookOpen,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function RecommendationsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div id="recommendations-header" className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Mitigation Strategies</h1>
            <p className="text-slate-500 font-medium mt-1">AI-powered recommendations to neutralize detected bias.</p>
          </div>
          <Button id="btn-knowledge-base" variant="outline" className="h-10 bg-white font-bold italic group">
            Knowledge Base
            <BookOpen className="ml-2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          </Button>
        </div>

        {/* Priority 1: High Impact */}
        <div id="high-impact-section" className="space-y-6">
           <h2 id="critical-alert-label" className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Critical Action Required
           </h2>
           
           <Card id="critical-recommendation-card" className="border-l-4 border-l-red-500 border-slate-200 bg-white shadow-xl overflow-hidden group">
              <CardContent className="p-0">
                 <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-8 p-8">
                       <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-red-500 text-white font-bold h-6">HIGH IMPACT</Badge>
                          <span className="text-sm font-bold text-slate-400 italic font-mono">CODE: MRM-402</span>
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-4 italic tracking-tight">Adaptive Under-sampling: Age Demographic</h3>
                       <p className="text-slate-500 leading-relaxed font-medium mb-8">
                         Your training set has a <strong className="text-slate-900 font-bold">12.5x</strong> over-representation of the 45-54 group compared to 18-24. This is driving the disparity in loan approval rates. Implementing adaptive under-sampling will normalize the influence of dominant groups.
                       </p>
                       <div id="rec-metrics" className="flex flex-wrap gap-3">
                          <div id="dataset-tag" className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                             <Database className="w-4 h-4 text-indigo-500" />
                             Dataset: core_v4.csv
                          </div>
                          <div id="parity-gain-tag" className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                             <Scale className="w-4 h-4 text-emerald-500" />
                             Est. Parity Gain: +18%
                          </div>
                          <div id="latency-tag" className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                             <Zap className="w-4 h-4 text-amber-500" />
                             Latency Impact: Low
                          </div>
                       </div>
                    </div>
                    <div id="cta-mitigation-panel" className="lg:col-span-4 bg-slate-900 p-8 flex flex-col justify-between group-hover:bg-slate-950 transition-colors">
                       <div className="text-white">
                          <h4 className="text-lg font-bold mb-2 italic tracking-tight flex items-center gap-2">
                             <Sparkles className="w-5 h-5 text-indigo-400" />
                             One-Click Fix
                          </h4>
                          <p className="text-slate-400 text-xs font-medium">FairLens will generate a balanced synthetic dataset and re-trigger model training.</p>
                       </div>
                       <Button id="btn-apply-mitigation" className="w-full h-12 bg-white text-slate-900 font-bold hover:bg-white/90 shadow-lg shadow-white/10 group" onClick={() => {
                          toast.success("Mitigation strategy applied", { description: "Synthetic rebalancing initiated. Your dataset will be updated within 2 minutes." });
                       }}>
                          Apply Mitigation
                          <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Other Recommendations */}
        <div id="other-recommendations-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
              {
                id: "REC-1",
                title: "Adversarial Debiasing",
                desc: "Train an adversary model to predict protected attributes from the model embeddings and subtract that influence.",
                impact: "Medium",
                gain: "+12% Parity",
                type: "Processing"
              },
              {
                id: "REC-2",
                title: "Threshold Moving",
                desc: "Decouple decision thresholds by group to ensure Equal Opportunity metrics are met for all protected attributes.",
                impact: "Low",
                gain: "+09% Parity",
                type: "Post-Processing"
              }
           ].map((rec) => (
             <Card id={`rec-card-${rec.id}`} key={rec.id} className="border-slate-200 bg-white hover:border-primary/30 transition-all cursor-pointer">
                <CardHeader className="p-6 pb-0">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                         <Settings2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 uppercase">{rec.type}</Badge>
                   </div>
                   <CardTitle className="text-lg font-bold italic">{rec.title}</CardTitle>
                   <CardDescription className="font-medium text-slate-500 py-2">{rec.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-4">
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                      Impact
                      <span className="text-slate-900">{rec.impact}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                      Parity Gain
                      <span className="text-emerald-500">{rec.gain}</span>
                   </div>
                   <Button id={`btn-view-guide-${rec.id}`} variant="secondary" className="w-full mt-4 font-bold italic group" onClick={() => {
                      toast.info(`Opening guide for ${rec.title}`, { description: "Documentation will open in a new tab." });
                   }}>
                      View Implementation Guide
                      <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                   </Button>
                </CardContent>
             </Card>
           ))}
        </div>

        {/* Feature Suggestion Banner */}
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center gap-6 shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-emerald-900 italic tracking-tight">Proxy Discovery Complete</h4>
              <p className="text-emerald-700 text-sm font-medium mt-1">Removing the <strong className="text-emerald-900">'Postal_Code'</strong> feature improved fairness by 22% with only a 0.5% drop in accuracy.</p>
           </div>
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-10 rounded-xl" onClick={() => {
              toast.success("Changes committed", { description: "Your model configuration has been updated with the new proxy-free feature set." });
           }}>Review Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
