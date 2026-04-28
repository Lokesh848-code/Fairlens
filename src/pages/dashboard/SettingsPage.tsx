import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Database, 
  Globe, 
  ChevronRight,
  Plus,
  Copy,
  Eye,
  Trash2,
  Lock,
  Mail,
  Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const navItems = [
    { label: "Profile", icon: User },
    { label: "Security", icon: Shield },
    { label: "API Keys", icon: Key },
    { label: "Integrations", icon: Zap },
    { label: "Notifications", icon: Bell },
    { label: "Billing", icon: Database },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="pb-2 border-b border-slate-200">
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">System Settings</h1>
           <p className="text-slate-500 font-medium mt-1">Manage your professional audit environment and security.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Navigation Sidebar */}
           <div className="lg:col-span-1 space-y-1">
              {navItems.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTab(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left",
                    activeTab === item.label ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-white hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
           </div>

           {/* Content */}
           <div className="lg:col-span-3 space-y-8">
              {activeTab === "Profile" && (
                <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                   <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-bold italic tracking-tight">Account Information</CardTitle>
                      <CardDescription>Update your personal details and organization role.</CardDescription>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row gap-8 items-center border-b border-slate-50 pb-8">
                         <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold italic shadow-xl">EL</div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-primary transition-colors">
                               <Plus className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="flex-1 space-y-4 w-full">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Name</Label>
                                  <Input defaultValue="Erik" className="h-10 border-slate-200" />
                               </div>
                               <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Name</Label>
                                  <Input defaultValue="Thorsen" className="h-10 border-slate-200" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</Label>
                               <Input defaultValue="Chief Ethics Architect" className="h-10 border-slate-200" />
                            </div>
                         </div>
                      </div>
                      
                      <div className="pt-2">
                         <Button className="font-bold px-8 h-11 shadow-lg shadow-primary/20">Save Profile Changes</Button>
                      </div>
                   </CardContent>
                </Card>
              )}

              {activeTab === "API Keys" && (
                <Card className="border-slate-200 bg-white shadow-sm">
                   <CardHeader className="p-8 pb-0 flex flex-row justify-between items-start">
                      <div>
                         <CardTitle className="text-xl font-bold italic tracking-tight">External API Integration</CardTitle>
                         <CardDescription>Use these keys to authenticate your CI/CD audit pipeline.</CardDescription>
                      </div>
                      <Button variant="outline" className="h-9 font-bold bg-white text-xs">
                         <Plus className="w-3 h-3 mr-2" />
                         New Secret
                      </Button>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                         <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                               <Badge className="bg-indigo-600 text-white font-bold h-5 uppercase text-[9px] tracking-widest">PROD_ENV</Badge>
                               <span className="text-sm font-bold text-slate-900 italic">Core Audit Engine</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Last used: 2h ago</span>
                         </div>
                         <div className="flex gap-2">
                            <div className="relative flex-1 group">
                               <Input 
                                 type={apiKeyVisible ? "text" : "password"} 
                                 value="fl_live_9k2m8n3v0x8s7d1q5w4e" 
                                 readOnly 
                                 className="h-10 bg-white border-slate-200 font-mono pr-20 text-xs"
                               />
                               <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                  <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="p-1 hover:text-primary text-slate-400">
                                     <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => copyToClipboard("fl_live_9k2m8n3v0x8s7d1q5w4e")} className="p-1 hover:text-primary text-slate-400">
                                     <Copy className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-red-400 hover:bg-red-50 hover:text-red-600">
                               <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              )}

              {activeTab === "Notifications" && (
                <Card className="border-slate-200 bg-white shadow-sm">
                   <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-bold italic tracking-tight">Security Notifications</CardTitle>
                      <CardDescription>Configure how you receive drift alerts and audit summaries.</CardDescription>
                   </CardHeader>
                   <CardContent className="p-8 pt-6 space-y-6">
                      {[
                        { title: "Drift Violation Alerts", desc: "Immediate webhook and email notification when parity drops < 0.80.", icon: Shield },
                        { title: "Weekly Compliance Recap", desc: "A summary of all audit results and unresolved bias risks.", icon: Mail },
                        { title: "System Health & Access", desc: "Log every login attempt and system-wide security event.", icon: Lock },
                      ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                 <pref.icon className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900 italic tracking-tight">{pref.title}</p>
                                 <p className="text-xs text-slate-500 font-medium mt-0.5">{pref.desc}</p>
                              </div>
                           </div>
                           <Checkbox defaultChecked className="h-5 w-5 rounded-md border-slate-200" />
                        </div>
                      ))}
                   </CardContent>
                </Card>
              )}

              {["Security", "Integrations", "Billing"].includes(activeTab) && (
                <Card className="border-slate-200 bg-white shadow-sm border-dashed border-2 p-12 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                      <Lock className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 italic tracking-tight">{activeTab} module restricted</h3>
                   <p className="text-slate-500 text-sm font-medium mt-2 max-w-sm">
                      This module requires Enterprise Admin permissions. Contact your organization administrator to unlock access.
                   </p>
                   <Button variant="outline" className="mt-8 font-bold">Request Permission</Button>
                </Card>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
