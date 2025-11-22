import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Globe, Lock, BarChart3, Users, ArrowRight, Check } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { SEOHead } from '@/components/SEOHead';
export default function Landing() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hyperion-Flux',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Advanced cyber operations platform with APT simulation, compliance automation, and DevSecOps integration'
  };
  const features = [{
    icon: Shield,
    title: 'Advanced Security',
    description: 'Enterprise-grade security with real-time threat detection and risk management'
  }, {
    icon: Zap,
    title: 'Cyber Simulations',
    description: 'Run realistic security scenarios to test and improve your defenses'
  }, {
    icon: Globe,
    title: 'Global Operations',
    description: 'Manage distributed teams across 25+ languages with RTL support'
  }, {
    icon: Lock,
    title: 'Compliance Ready',
    description: 'SOC 2, ISO 27001, and GDPR compliance built-in from day one'
  }, {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Comprehensive dashboards and metrics for informed decision making'
  }, {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Role-based access control and seamless team coordination'
  }];
  const highlights = ['Multi-tenant architecture', 'Advanced RBAC', '99.9% uptime SLA', 'Dedicated support', 'Custom integrations', 'White-label options'];
  return <div className="min-h-screen bg-background">
      <SEOHead title="Hyperion-Flux - Advanced Cyber Operations Platform" description="Enterprise security operations platform with APT simulation, compliance automation, architecture visualization, and AI-powered analysis for modern security teams." keywords="cyber security, APT simulation, compliance automation, DevSecOps, SBOM, MITRE ATT&CK, security operations center" jsonLd={jsonLd} />
      
      {/* Header */}
      <header className="border-b border-border/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Hyperion-Flux
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <ThemeToggle />
            <LocaleSwitcher />
            <Link to="/app/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/app/register">
              <Button size="sm" className="animate-scale-in">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6 animate-scale-in">
                Advanced Cyber Operations Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Mission Control for Global Cyber Operations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enterprise-grade platform for managing security operations, simulations, and infrastructure across distributed teams worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app/register">
                <Button size="lg" className="group animate-scale-in">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline" className="animate-scale-in">
                  View Documentation
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Cyber Excellence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and features designed for modern security operations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Security Highlights */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise-Grade Security & Compliance
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Built with security at its core. Hyperion-Flux meets the highest industry standards for data protection and compliance.
              </p>
              <div className="grid gap-4">
                {highlights.map((highlight, index) => <div key={index} className="flex items-center gap-3 animate-slide-in-right" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{highlight}</span>
                  </div>)}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 animate-pulse" />
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-primary/20 bg-background/50 backdrop-blur animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Ready to Transform Your Cyber Operations?
              </CardTitle>
              <CardDescription className="text-lg">
                Join leading enterprises worldwide in securing their digital infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app/register">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>;
}