import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Github, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back to FairLens AI");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Access Dashboard" 
      subtitle="Sign in to manage your AI audit pipeline."
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@company.com" 
            required 
            className="h-11 bg-white border-slate-200 focus:ring-primary/20"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              className="h-11 pr-10 bg-white border-slate-200 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer">
            Remember this device for 30 days
          </Label>
        </div>
        
        <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
          {isLoading ? "Validating Session..." : "Sign In to FairLens"}
        </Button>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-400">
            <span className="bg-slate-50 px-4">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="bg-white border-slate-200">
            <Chrome className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button variant="outline" type="button" className="bg-white border-slate-200">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline italic">Create one for free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
