import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Database, 
  ScanSearch,
  Clock,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const audits = [
  { id: "AUD-4201", target: "Credit_Scorer_v2", date: "2024-03-28", type: "Model Eval", score: "84/100", status: "Resolved" },
  { id: "AUD-4198", target: "Hiring_Dataset_Full", date: "2024-03-27", type: "Dataset Scan", score: "72/100", status: "Critical" },
  { id: "AUD-4155", target: "Fraud_Detection_Beta", date: "2024-03-25", type: "Model Eval", score: "92/100", status: "Passed" },
  { id: "AUD-4122", target: "Customer_Churn_v1", date: "2024-03-22", type: "Explainability", score: "N/A", status: "Passed" },
  { id: "AUD-4099", target: "Risk_Engine_Final", date: "2024-03-18", type: "Dataset Scan", score: "88/100", status: "Resolved" },
];

export default function AuditHistoryPage() {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audits")
      .then(res => res.json())
      .then(data => {
        setAudits(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Audit History</h1>
              <p className="text-slate-500 font-medium mt-1">Review past bias scans, model evaluations, and mitigation records.</p>
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              <Button size="sm" variant="ghost" className="h-8 text-xs font-bold bg-primary text-white shadow-sm">All Audits</Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-slate-400">Archived</Button>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search by Job ID or Model Name..." className="pl-10 h-11 bg-white border-slate-200 shadow-sm" />
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-11 bg-white font-bold border-slate-200 shadow-sm">
                 <Filter className="w-4 h-4 mr-2 text-slate-400" />
                 More Filters
              </Button>
           </div>
        </div>

        <Card className="border-slate-200 shadow-md bg-white overflow-hidden">
           <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                 {loading ? (
                    <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest italic">
                       Loading Audit Trail...
                    </div>
                 ) : audits.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest italic">
                       No audits found.
                    </div>
                 ) : audits.map((audit) => (
                   <div 
                     key={audit.id} 
                     onClick={() => navigate(`/report/${audit.id}`)}
                     className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer"
                   >
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                         <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110",
                            audit.model?.type === "Classification" ? "bg-indigo-50 border-indigo-100 text-indigo-600" : 
                            (audit.model?.type === "Dataset" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600")
                         )}>
                            {audit.model?.type === "Classification" ? <ScanSearch className="w-6 h-6" /> : 
                             (audit.model?.type === "Dataset" ? <Database className="w-6 h-6" /> : <History className="w-6 h-6" />)}
                         </div>
                         <div className="text-left">
                            <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors italic tracking-tight">{audit.model?.name || audit.target}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(audit.timestamp || audit.date).toLocaleDateString()}</span>
                               <span className="text-slate-300">|</span>
                               <span>{audit.id}</span>
                               <span className="text-slate-300">|</span>
                               <span className="italic">{audit.model?.type || audit.type}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-12">
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Fairness Score</p>
                            <p className={cn(
                               "text-lg font-bold italic tracking-tight",
                               (audit.fairnessScore ?? audit.score) === "N/A" ? "text-slate-300" : ((audit.fairnessScore * 100 || parseInt(audit.score)) < 80 ? "text-red-500" : "text-emerald-500")
                            )}>{audit.fairnessScore ? (audit.fairnessScore * 100).toFixed(0) : audit.score}</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <Badge variant="outline" className={cn(
                               "text-[10px] font-bold h-6 px-3 rounded-full border shadow-sm",
                               (audit.status === "Passed" || audit.status === "PASSED") ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                               ((audit.status === "Resolved" || audit.status === "RESOLVED") ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-red-50 text-red-600 border-red-100")
                            )}>
                               {(audit.status === "Passed" || audit.status === "PASSED") && <ShieldCheck className="w-3 h-3 mr-1.5" />}
                               {audit.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl">
                               <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
           <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Audit History &bull; Security Log Encrypted</p>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
