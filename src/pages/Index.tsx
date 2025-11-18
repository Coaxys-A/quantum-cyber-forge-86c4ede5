import { Hero } from "@/components/Hero";
import { ArchitecturePillars } from "@/components/ArchitecturePillars";
import { KeyCapabilities } from "@/components/KeyCapabilities";
import { ModuleGrid } from "@/components/ModuleGrid";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ArchitecturePillars />
      <KeyCapabilities />
      <ModuleGrid />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
