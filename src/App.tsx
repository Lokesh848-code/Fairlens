/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AuditPreview } from "@/components/landing/AuditPreview";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import DashboardOverviewPage from "@/pages/dashboard/DashboardOverviewPage";
import DatasetAuditPage from "@/pages/dashboard/DatasetAuditPage";
import ModelEvaluationPage from "@/pages/dashboard/ModelEvaluationPage";
import ExplainabilityPage from "@/pages/dashboard/ExplainabilityPage";
import RecommendationsPage from "@/pages/dashboard/RecommendationsPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import MonitoringPage from "@/pages/dashboard/MonitoringPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import AuditHistoryPage from "@/pages/dashboard/AuditHistoryPage";
import CompliancePage from "@/pages/dashboard/CompliancePage";
import SandboxPage from "@/pages/dashboard/SandboxPage";
import ReportDetailPage from "@/pages/dashboard/ReportDetailPage";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AuditPreview />
        <Features />
        
        {/* Simple CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 italic">Ready to Audit Your Ethics?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join leading organizations ensuring their automated systems are fair for everyone. 
              Start your first bias audit in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        {/* Dataset Audit */}
        <Route path="/dataset-audit" element={<DatasetAuditPage />} />
        {/* Model Evaluation */}
        <Route path="/model-eval" element={<ModelEvaluationPage />} />
        {/* Explainability */}
        <Route path="/explainability" element={<ExplainabilityPage />} />
        {/* Sandbox */}
        <Route path="/sandbox" element={<SandboxPage />} />
        {/* Recommendations */}
        <Route path="/recommendations" element={<RecommendationsPage />} />
        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />
        {/* Monitoring */}
        <Route path="/monitoring" element={<MonitoringPage />} />
        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        {/* Audit History */}
        <Route path="/history" element={<AuditHistoryPage />} />
        {/* Compliance */}
        <Route path="/compliance" element={<CompliancePage />} />
        {/* Placeholder Routes for Nav items */}
      </Routes>
      <Toaster />
    </Router>
  );
}
