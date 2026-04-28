import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  MoreHorizontal,
  FileBadge,
  Lock,
  Globe
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const reports = [
  { id: "REP-981", name: "Q1_Lending_Audit_Compliance", date: "2024-03-24", type: "PDF", status: "Certified", version: "v2.0" },
  { id: "REP-975", name: "Gender_Parity_Deep_Dive", date: "2024-03-12", type: "JSON", status: "Draft", version: "v1.1" },
  { id: "REP-962", name: "Bias_Mitigation_Log_Hiring", date: "2024-03-01", type: "PDF", status: "Certified", version: "v1.0" },
  { id: "REP-950", name: "Model_Explainability_Report", date: "2024-02-15", type: "PDF", status: "Archived", version: "v1.0" },
  { id: "REP-941", name: "Regulatory_Submission_AIA", date: "2024-02-01", type: "PDF", status: "Certified", version: "v3.2" },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  
  const handleExportReport = (reportName: string) => {
    toast.success(`Exporting ${reportName}`, { description: "Your compliance report is being generated." });
    setTimeout(() => {
      const blob = new Blob([`FairLens Compliance Report\nReport: ${reportName}\nGenerated: ${new Date().toISOString()}\n\nFairLens AI Audit Platform\nThis report certifies compliance with EU AI Act requirements.`], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, '_')}_compliance_report.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Compliance & Reporting</h1>
              <p className="text-slate-500 font-medium mt-1">Export regulatory-ready reports and audit trails.</p>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" className="h-10 bg-white font-bold flex-1 md:flex-none">
                 <Calendar className="w-4 h-4 mr-2" />
                 Schedule Recurring
              </Button>
              <Button className="h-10 font-bold shadow-lg shadow-primary/20 flex-1 md:flex-none">
                 <FileBadge className="w-4 h-4 mr-2" />
                 Audit Certification
              </Button>
           </div>
        </div>

        {/* Global Export Banner */}
        <Card className="bg-slate-900 overflow-hidden border-none shadow-2xl relative">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/10 opacity-50" />
           <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 p-4 bg-white/10 rounded-3xl border border-white/20">
                 <Globe className="w-12 h-12 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                 <h3 className="text-2xl font-bold text-white italic tracking-tight">Generate EU AI Act Technical Documentation</h3>
                 <p className="text-indigo-200 text-sm font-medium leading-relaxed max-w-2xl">
                    Our AI automatically generates Annex IV documentation required for High-Risk AI systems. 
                    Includes data provenance, feature engineering audit, and mitigation logs.
                 </p>
              </div>
              <Button size="lg" className="bg-white text-slate-900 font-bold px-8 h-12 rounded-xl italic hover:bg-white/90" onClick={() => {
                toast.info("Generating EU AI Act Documentation", { description: "This will take approximately 30 seconds. Annex IV technical documentation is being compiled." });
                setTimeout(() => {
                  toast.success("Documentation Generated", { description: "Your Annex IV compliance package is ready for download." });
                  handleExportReport("EU_AI_Act_Annex_IV");
                }, 3000);
              }}>
                Start Generation
              </Button>
           </CardContent>
        </Card>

        {/* Reports Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search reports by ID or name..." className="pl-10 h-10 bg-white border-slate-200" />
           </div>
           <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="font-bold text-slate-400 h-9" onClick={() => toast.info("Filter panel opening...")}>
                 <Filter className="w-4 h-4 mr-2" />
                 Filters
              </Button>
              <Button variant="ghost" size="sm" className="font-bold text-slate-400 h-9" onClick={() => {
                toast.success("Report list exported", { description: "CSV with all 42 compliance artifacts has been downloaded." });
              }}>
                 <Download className="w-4 h-4 mr-2" />
                 Export List
              </Button>
           </div>
        </div>

        {/* Reports Table */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                       <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Report Reference</th>
                       <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Generation Date</th>
                       <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Status</th>
                       <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {reports.map((report) => (
                       <tr key={report.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                   <FileText className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{report.name}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{report.id} &bull; {report.version} &bull; {report.type}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                             <span className="text-sm font-medium text-slate-500">{report.date}</span>
                          </td>
                          <td className="p-6">
                             <Badge variant="outline" className={cn(
                                "text-[10px] font-bold h-6 px-3 rounded-full",
                                report.status === "Certified" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                (report.status === "Draft" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-200")
                             )}>
                                {report.status === "Certified" && <ShieldCheck className="w-3 h-3 mr-1.5" />}
                                {report.status}
                             </Badge>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleExportReport(report.name)}>
                                   <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => {
                                  toast.info(`${report.name}`, { description: `Version ${report.version} • ${report.status} • Generated ${report.date}` });
                                }}>
                                   <MoreHorizontal className="w-4 h-4" />
                                </Button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span>Showing 5 of 42 compliance artifacts</span>
              <div className="flex items-center gap-2">
                 <button className="p-1 hover:text-slate-900 disabled:opacity-30" disabled><ChevronRight className="w-4 h-4 rotate-180" /></button>
                 <span className="text-slate-900">Page 1 of 9</span>
                 <button className="p-1 hover:text-slate-900"><ChevronRight className="w-4 h-4" /></button>
              </div>
           </div>
        </Card>

        {/* Audit Vault */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="p-8 border-slate-200 bg-white">
              <Lock className="w-8 h-8 text-slate-300 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3 italic tracking-tight">Audit Log Vault</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                Immutable record of every audit performed. Tamper-proof logs stored with cryptographic hashes for legal defensibility.
              </p>
              <Button variant="outline" className="font-bold h-10 border-slate-200" onClick={() => {
                toast.success("Secure Vault Accessed", { description: "Connecting to encrypted audit log storage..." });
                navigate("/history");
              }}>Access Secure Logs</Button>
           </Card>
           
           <Card className="p-8 border-emerald-100 bg-emerald-50/50 border-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-emerald-900 mb-3 italic tracking-tight">Certification Status</h3>
              <p className="text-emerald-700 text-sm font-medium leading-relaxed mb-6">
                Your primary model <strong className="text-emerald-900 font-bold">Lending_v4</strong> is currently certified until 2024-09-12. Verification performed by FairLens Engine v2.1.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 shadow-lg shadow-emerald-600/20" onClick={() => {
                toast.success("Certificate Valid", { description: "Lending_v4 is certified until 2024-09-12. Blockchain verification hash: 0x7a3f...9e2d" });
                handleExportReport("FairLens_Certificate_Lending_v4");
              }}>View Certificate</Button>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
