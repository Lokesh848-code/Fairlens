import * as React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* Left side: Form */}
      <div className="flex flex-col p-8 lg:p-12 xl:p-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">FairLens AI</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 italic tracking-tight">{title}</h1>
            <p className="text-slate-500 font-medium">{subtitle}</p>
          </div>
          
          {children}
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} FairLens AI. Secure & Compliant.
        </div>
      </div>
      
      {/* Right side: Visual/Social Proof */}
      <div className="hidden lg:flex flex-col relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-emerald-500/10 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] z-0" />
        
        <div className="relative z-10 flex-1 flex flex-col justify-center p-16 xl:p-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">
              Industry Standard
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-8 italic tracking-tight leading-tight">
              Responsible AI <br />
              starts with a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">clean audit.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                { label: "Predictive Analytics", score: "84%" },
                { label: "Fairness Index", score: "92/100" },
                { label: "Privacy Guard", score: "Active" }
              ].map((metric, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    {metric.label}
                    <span className={i === 1 ? "text-emerald-400" : "text-white"}>{metric.score}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i === 0 ? "84%" : i === 1 ? "92%" : "100%" }}
                      className={`h-full ${i === 1 ? "bg-emerald-400" : "bg-indigo-500"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center font-bold text-sm">ET</div>
              <p className="text-sm text-slate-300 italic">
                "FairLens has automated our model risk management, cutting audit times by 80%."
                <br />
                <span className="text-xs font-bold text-slate-500 not-italic uppercase mt-1 inline-block">Chief Data Officer @ FinTech Global</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
