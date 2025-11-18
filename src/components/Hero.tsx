import { Button } from "@/components/ui/button";
import { Shield, Zap, Lock } from "lucide-react";
import heroImage from "@/assets/hero-cyber.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with image and overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Cyber operations command center" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial opacity-40 blur-3xl animate-pulse-glow" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium">Next-Gen Cyber Operations Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Hyperion-Flux
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            AI-Driven Cyber Range with Digital Twins, Confidential Computing, and Post-Quantum Security
          </p>

          <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl">
            Enterprise-grade cyber operations framework combining multi-agent AI, zero-trust architecture, and blockchain-anchored provenance for the next generation of security operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" variant="cyber" className="group">
              Deploy Platform
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="group">
              View Architecture
              <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-3xl">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Core Pillars</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">Integrated Modules</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Attack Scenarios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
