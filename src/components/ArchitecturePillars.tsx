import { Card } from "@/components/ui/card";
import { 
  GitBranch, 
  Brain, 
  ShieldCheck, 
  Box, 
  Activity, 
  Network, 
  FileCheck 
} from "lucide-react";

const pillars = [
  {
    icon: GitBranch,
    title: "Digital-Twin Engine",
    description: "High-fidelity replicas of production infrastructure for safe, realistic attack-defense simulation.",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Brain,
    title: "Swarm AI",
    description: "Multi-agent reinforcement learning orchestrating autonomous red and blue team operations at machine speed.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: ShieldCheck,
    title: "Confidential Computing",
    description: "Hardware-enforced enclaves (SGX/SEV/TDX) protecting sensitive workloads during execution.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Box,
    title: "Wasm Micro-Kernel",
    description: "Capability-based sandboxing for untrusted plugins with hot-swap module updates.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Activity,
    title: "eBPF Telemetry",
    description: "Kernel-level observability capturing system calls, network flows, and process behavior in real-time.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Network,
    title: "PQC Zero-Trust Mesh",
    description: "Post-quantum cryptography with continuous verification across all service interactions.",
    color: "from-rose-500 to-orange-500"
  },
  {
    icon: FileCheck,
    title: "Blockchain SBOM",
    description: "Tamper-proof software bill of materials with cryptographic provenance tracking.",
    color: "from-orange-500 to-cyan-500"
  }
];

export const ArchitecturePillars = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Seven Architecture Pillars
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on cutting-edge technologies that converge security, AI, and verifiable infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={index}
                className="group relative p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
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
