import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  AlertCircle, 
  FileCheck, 
  Globe, 
  Scale, 
  Lock, 
  Info,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const frameworks = [
  { 
    id: "eu-ai-act", 
    name: "EU AI Act Compliance", 
    desc: "Harmonised rules on AI for the internal market.", 
    status: "In Progress", 
    progress: 65,
    items: [
       { label: "Annex IV: Technical Documentation", status: "Completed" },
       { label: "Data Governance & Dataset Audit", status: "Completed" },
       { label: "Human Oversight Mechanisms", status: "Pending" },
       { label: "Risk Management System", status: "In Progress" },
       { label: "Accuracy & Cybersecurity", status: "Pending" },
    ]
  },
  { 
    id: "nist-ai-rmf", 
    name: "NIST AI Risk Management", 
    desc: "A framework for managing risks to individuals, organizations, and society.", 
    status: "Draft", 
    progress: 25,
    items: [
       { label: "Govern: Culture & Accountability", status: "Completed" },
       { label: "Map: Context & Risk ID", status: "Pending" },
       { label: "Measure: Impact Assessment", status: "Pending" },
       { label: "Manage: Mitigation & Monitoring", status: "In Progress" },
    ]
  }
];

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState(frameworks[0]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Regulatory Compliance</h1>
              <p className="text-slate-500 font-medium mt-1">Track and document alignment with global AI regulations.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-10 bg-white font-bold">
                 <Globe className="w-4 h-4 mr-2" />
                 Global Standards
              </Button>
              <Button className="h-10 font-bold shadow-lg shadow-primary/20">
                 <Download className="w-4 h-4 mr-2" />
                 Export Final Dossier
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Framework List */}
           <div className="lg:col-span-4 space-y-4">
              {frameworks.map((f) => (
                <Card 
                  key={f.id} 
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    selectedFramework.id === f.id ? "border-primary shadow-md scale-[1.02]" : "border-slate-100 hover:border-slate-200"
                  )}
                  onClick={() => setSelectedFramework(f)}
                >
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                           "p-2 rounded-xl",
                           selectedFramework.id === f.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                        )}>
                           {f.id === "eu-ai-act" ? <Scale className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <Badge variant="outline" className={cn(
                           "text-[10px] font-bold h-5 uppercase tracking-widest",
                           f.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                           {f.status}
                        </Badge>
                     </div>
                     <h3 className="text-sm font-bold text-slate-900 mb-1">{f.name}</h3>
                     <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">{f.desc}</p>
                     
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Progress</span>
                           <span>{f.progress}%</span>
                        </div>
                        <Progress value={f.progress} className="h-1 bg-slate-100" />
                     </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                 <CardContent className="p-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request Custom Framework</p>
                 </CardContent>
              </Card>
           </div>

           {/* Framework Details */}
           <div className="lg:col-span-8">
              <Card className="border-slate-200 bg-white shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                 <CardHeader className="bg-slate-900 text-white p-8">
                    <div className="flex justify-between items-start">
                       <div>
                          <CardTitle className="text-2xl font-bold italic tracking-tight">{selectedFramework.name}</CardTitle>
                          <CardDescription className="text-slate-400 font-medium mt-1">{selectedFramework.desc}</CardDescription>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Compliance Health</p>
                          <div className="text-2xl font-bold text-emerald-400">GOOD</div>
                       </div>
                    </div>
                 </CardHeader>
                 
                 <CardContent className="p-8 space-y-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 text-indigo-500">
                             <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Documentation Status</p>
                             <p className="text-sm font-bold text-slate-900">12 of 18 sections complete</p>
                          </div>
                       </div>
                       <div className="p-5 rounded-2xl bg-white border-2 border-amber-100 flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 shadow-sm flex items-center justify-center border border-amber-100 text-amber-600">
                             <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Attention Required</p>
                             <p className="text-sm font-bold text-slate-900">3 missing oversight locks</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Requirements Checklist</h4>
                       <div className="divide-y divide-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                          {selectedFramework.items.map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                   <Checkbox 
                                     id={`check-${i}`} 
                                     checked={item.status === "Completed"} 
                                     className="h-5 w-5 rounded-md border-slate-200"
                                   />
                                   <Label htmlFor={`check-${i}`} className="text-sm font-bold text-slate-900 italic tracking-tight">{item.label}</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Badge variant="ghost" className={cn(
                                      "text-[9px] font-bold h-5 uppercase tracking-tighter",
                                      item.status === "Completed" ? "text-emerald-500" : (item.status === "Pending" ? "text-slate-300" : "text-amber-500")
                                   )}>
                                      {item.status}
                                   </Badge>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                      <ChevronRight className="w-4 h-4" />
                                   </Button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </CardContent>
                 
                 <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Lock className="w-4 h-4 text-slate-400" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed & Verified by FairLens Auditor</span>
                    </div>
                    <Button className="h-11 px-8 font-bold shadow-lg shadow-primary/20 italic">Update Auditor Logs</Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
