import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Shield, TrendingUp } from "lucide-react";

const capabilities = [
  {
    icon: Target,
    title: "Red Team Sandbox",
    description: "Enclave-isolated playground with on-chain proof of every binary. Safe testing of offensive techniques without production risk.",
    benefits: ["Shadow implant prevention", "Cryptographic auditability", "Zero production exposure"],
    color: "text-rose-500"
  },
  {
    icon: Shield,
    title: "Blue Team Training",
    description: "Replay post-quantum crypto transition drills and kernel-level telemetry to validate detection capabilities before deployment.",
    benefits: ["PQC readiness testing", "Real-time threat detection", "Production validation"],
    color: "text-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Executive Visibility",
    description: "Cryptographic evidence of compliance with AI-generated risk metrics from digital twin simulations.",
    benefits: ["Compliance automation", "Risk quantification", "Board-ready reporting"],
    color: "text-amber-500"
  }
];

export const KeyCapabilities = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background to-card/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-2">
            Built for Modern Security Operations
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Unified Platform for Every Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From offensive security to compliance, Hyperion-Flux provides enterprise-grade capabilities across your entire security organization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all group hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
              >
                <div className="space-y-6">
                  <div className={`inline-flex p-4 rounded-xl bg-card ring-1 ring-border ${capability.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{capability.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {capability.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4">
                    {capability.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
