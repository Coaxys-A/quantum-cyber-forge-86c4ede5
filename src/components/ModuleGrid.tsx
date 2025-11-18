import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const modules = [
  { id: 1, name: "Scenario Engine", status: "active", category: "Core" },
  { id: 2, name: "AI Orchestrator", status: "active", category: "AI/ML" },
  { id: 3, name: "Enclave Manager", status: "active", category: "Security" },
  { id: 4, name: "Wasm Runtime", status: "active", category: "Core" },
  { id: 5, name: "eBPF Collector", status: "active", category: "Telemetry" },
  { id: 6, name: "Crypto Gateway", status: "active", category: "Security" },
  { id: 7, name: "SBOM Ledger", status: "active", category: "Compliance" },
  { id: 8, name: "Twin Sync", status: "beta", category: "Core" },
  { id: 9, name: "Policy Engine", status: "active", category: "Security" },
  { id: 10, name: "Metrics Hub", status: "active", category: "Analytics" },
  { id: 11, name: "Alert Router", status: "active", category: "Operations" },
  { id: 12, name: "Threat Intel", status: "beta", category: "AI/ML" },
  { id: 13, name: "Network Sim", status: "active", category: "Core" },
  { id: 14, name: "Payload Vault", status: "active", category: "Security" },
  { id: 15, name: "Audit Logger", status: "active", category: "Compliance" },
  { id: 16, name: "Recovery System", status: "active", category: "Operations" },
];

export const ModuleGrid = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Modular Architecture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            20+ integrated modules working in concert to provide comprehensive cyber operations capabilities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="group relative p-4 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:bg-card/50 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      module.status === 'active' ? 'bg-primary animate-pulse-glow' : 'bg-amber-500'
                    }`} />
                    <span className="text-xs text-muted-foreground font-mono">
                      M{module.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {module.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Active
            </span>
            <span className="mx-4">·</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Beta
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
