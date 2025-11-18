import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Github } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
          {/* Glowing orb effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial opacity-30 blur-3xl" />
          
          <div className="relative p-12 md:p-16 text-center space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to Deploy Next-Gen Cyber Operations?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join leading enterprises leveraging digital twins, confidential computing, and post-quantum security to stay ahead of evolving threats.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="cyber" className="group">
                Request Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group">
                <BookOpen className="w-4 h-4" />
                View Documentation
              </Button>
              <Button size="lg" variant="ghost" className="group">
                <Github className="w-4 h-4" />
                Explore on GitHub
              </Button>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">Enterprise</div>
                <div className="text-sm text-muted-foreground">Production-ready platform with full support</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">Open Source</div>
                <div className="text-sm text-muted-foreground">Core modules available under Apache 2.0</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">24/7 Support</div>
                <div className="text-sm text-muted-foreground">Dedicated security engineering team</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
