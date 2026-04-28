import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">FairLens AI</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Ensuring the future of artificial intelligence is equitable, transparent, and fair for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dataset-audit" className="hover:text-primary transition-colors">Dataset Audit</Link></li>
              <li><Link to="/model-eval" className="hover:text-primary transition-colors">Model Evaluation</Link></li>
              <li><Link to="/explainability" className="hover:text-primary transition-colors">Explainability Dashboard</Link></li>
              <li><Link to="/monitoring" className="hover:text-primary transition-colors">Bias Monitoring</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} FairLens AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">LinkedIn</a>
            <a href="#" className="hover:text-primary">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
