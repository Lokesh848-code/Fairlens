import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-12 translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-xs font-bold text-indigo-600 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Live: Consumer Credit Audit Engine v2.4
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-tight">
            The Standard for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Ethical AI Audits.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Ensuring high-stakes automated decisions are transparent, compliant, and equitable for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-indigo-600/20" asChild>
              <Link to="/signup">
                Start Audit Now
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-white border-slate-200" asChild>
              <Link to="/demo">Request Demo</Link>
            </Button>
          </div>
        </motion.div>

        {/* Feature badges */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: ShieldCheck, label: "GDPR Compliant" },
            { icon: BarChart3, label: "Live Monitoring" },
            { icon: Zap, label: "Real-time Audits" },
            { icon: Lock, label: "Secure Analysis" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-card border shadow-sm">
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
