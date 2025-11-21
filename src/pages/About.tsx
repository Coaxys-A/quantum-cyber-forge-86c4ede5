import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Globe, Target } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Hyperion-Flux</span>
          </Link>
          <Link to="/app/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building the Future of Cyber Operations
            </h1>
            <p className="text-xl text-muted-foreground">
              Hyperion-Flux was founded with a singular mission: to provide enterprise organizations
              with the most advanced cyber operations platform available.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 animate-fade-in">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-4" />
                <CardTitle>Security First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We prioritize security in every decision, from design to deployment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-4" />
                <CardTitle>Team Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our global team of experts brings decades of cybersecurity experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-4" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Supporting operations across 25+ languages and all major regions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Constantly evolving to meet emerging cyber threats and challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Story</h2>
            <p>
              Founded in 2024 by a team of cybersecurity veterans, Hyperion-Flux emerged from a
              recognition that existing cyber operations tools were fragmented, complex, and unable
              to scale with modern enterprise needs.
            </p>
            <p>
              We set out to build something different: a unified platform that combines security
              operations, simulation, architecture monitoring, and risk management into a single,
              cohesive experience.
            </p>
            <p>
              Today, Hyperion-Flux serves enterprises around the globe, protecting critical
              infrastructure and enabling security teams to work more efficiently and effectively.
            </p>
            <p>
              Our platform is trusted by organizations that cannot afford downtime or compromise,
              and we take that responsibility seriously every single day.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}