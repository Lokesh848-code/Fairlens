import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Info } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully. Welcome aboard!");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Create Workspace" 
      subtitle="Start auditing your AI models for fairness today."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="Erik" 
              required 
              className="h-11 bg-white border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Thorsen" 
              required 
              className="h-11 bg-white border-slate-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="organization">Organization Name</Label>
          <Input 
            id="organization" 
            placeholder="EthicalAI Systems Inc." 
            required 
            className="h-11 bg-white border-slate-200"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@company.com" 
            required 
            className="h-11 bg-white border-slate-200"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Min. 8 characters" 
            required 
            className="h-11 bg-white border-slate-200"
          />
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <Check className="w-3 h-3 text-emerald-500" /> Upper/Lower
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <Check className="w-3 h-3 text-emerald-500" /> Symbol
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <Check className="w-3 h-3 text-emerald-500" /> 8+ Characters
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-indigo-50 border border-indigo-100/50 rounded-xl flex gap-3 my-6">
          <Info className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-xs text-indigo-600 font-medium leading-relaxed">
            By creating an account, you agree to our <a href="#" className="font-bold underline">Data Processing Agreement</a> which includes GDPR compliance and secure audit logging.
          </p>
        </div>
        
        <Button type="submit" className="w-full h-12 font-bold shadow-xl shadow-primary/20" disabled={isLoading}>
          {isLoading ? "Preparing Workspace..." : "Initialize Free Audit Pipeline"}
        </Button>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline italic">Sign in to FairLens</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
