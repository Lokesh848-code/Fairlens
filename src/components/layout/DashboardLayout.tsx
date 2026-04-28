import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Database, 
  Settings, 
  ShieldCheck, 
  LayoutDashboard, 
  ScanSearch, 
  FileText, 
  History, 
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Menu,
  ShieldAlert,
  Scale,
  Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AICopilot } from "@/components/dashboard/AICopilot";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dataset Audit", href: "/dataset-audit", icon: Database },
    { name: "Model Evaluation", href: "/model-eval", icon: ScanSearch },
    { name: "Explainability", href: "/explainability", icon: ShieldCheck },
    { name: "Fairness Sandbox", href: "/sandbox", icon: Beaker },
    { name: "Recommendations", href: "/recommendations", icon: ShieldAlert },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Monitoring", href: "/monitoring", icon: BarChart3 },
    { name: "Compliance", href: "/compliance", icon: Scale },
    { name: "Audit History", href: "/history", icon: History },
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-40",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-bold tracking-tight text-slate-900 italic">FairLens AI</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-bold",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                {isSidebarOpen && <span>{item.name}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div layoutId="activeNav" className="ml-auto">
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <Link 
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-bold"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search audits, datasets, reports..." 
                className="pl-10 h-10 bg-slate-50 border-none focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 italic">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Optimal Performance
            </div>
            
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-0 hover:bg-transparent flex items-center gap-3 bg-transparent border-none cursor-pointer outline-none">
                <Avatar className="h-9 w-9 border-2 border-slate-100">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">EL</AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col items-start">
                  <span className="text-sm font-bold text-slate-900 leading-none mb-1 text-left">Erik Lokissen</span>
                  <span className="text-xs font-medium text-slate-400 tracking-tight">Admin &bull; FairLens AI</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-100">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing & Plans</DropdownMenuItem>
                <DropdownMenuItem>Team Management</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  Logout Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {children}
        </main>
      </div>
      <AICopilot />
    </div>
  );
}
