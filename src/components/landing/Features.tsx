import { ShieldAlert, Fingerprint, Search, LineChart, FileCheck, RefreshCw } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Dataset Bias Detection",
      description: "Analyze your training data for statistical imbalances and proxy feature dependencies that cause disparate impact.",
      icon: ShieldAlert,
      color: "bg-red-500/10 text-red-500"
    },
    {
      title: "Proxy Feature Analysis",
      description: "Automatically identify hidden variables like zip code or education level that act as surrogates for protected attributes.",
      icon: Fingerprint,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "XAI: Explainable Decisions",
      description: "Use SHAP and LIME integration to explain exactly why an automated decision was made for any specific individual.",
      icon: Search,
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      title: "Fairness Score Engine",
      description: "Measure demographic parity, equal opportunity, and equalized odds with our proprietary audit engine.",
      icon: LineChart,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      title: "Audit Reports",
      description: "Generate boardroom-ready compliance reports (EU AI Act, GDPR Article 22) at the click of a button.",
      icon: FileCheck,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Continuous Monitoring",
      description: "Get real-time alerts when your model performance drifts or bias increases in production environments.",
      icon: RefreshCw,
      color: "bg-cyan-500/10 text-cyan-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">Uncompromising Fairness</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to audit, understand, and optimize your AI systems for ethical deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-card border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
