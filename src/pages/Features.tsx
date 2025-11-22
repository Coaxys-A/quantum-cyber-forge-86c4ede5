import { Shield, Zap, Globe, Lock, TrendingUp, Users } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Security Posture Management',
    description: 'Continuous monitoring of your security infrastructure with real-time risk assessment, vulnerability detection, and automated remediation workflows.',
    benefits: ['Real-time threat detection', 'Automated compliance checks', 'Risk scoring and prioritization'],
  },
  {
    icon: Zap,
    title: 'APT Simulation Engine',
    description: 'Simulate advanced persistent threats using MITRE ATT&CK framework to test your defenses against sophisticated attack campaigns.',
    benefits: ['MITRE ATT&CK mapping', 'Multi-stage attack scenarios', 'Detailed forensic reports'],
  },
  {
    icon: Globe,
    title: 'Architecture Visibility',
    description: 'Interactive architecture graphs showing all components, dependencies, and data flows with health monitoring and security analysis.',
    benefits: ['Dependency mapping', 'Health status tracking', 'Attack path visualization'],
  },
  {
    icon: Lock,
    title: 'Compliance Automation',
    description: 'Automated compliance management for ISO27001, SOC2, NIST, and CIS frameworks with evidence collection and audit reporting.',
    benefits: ['Multi-framework support', 'Evidence automation', 'Audit-ready reports'],
  },
  {
    icon: TrendingUp,
    title: 'DevSecOps Integration',
    description: 'SBOM generation, dependency scanning, CI/CD security analysis, and vulnerability management integrated into your development pipeline.',
    benefits: ['SBOM generation', 'Dependency tracking', 'Pipeline security'],
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Role-based access control, team workspaces, shared dashboards, and collaborative risk management for security and ops teams.',
    benefits: ['RBAC and SSO', 'Shared workspaces', 'Activity tracking'],
  },
];

export default function Features() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Features',
    description: 'Comprehensive security operations platform with APT simulation, compliance automation, and DevSecOps integration',
    provider: {
      '@type': 'Organization',
      name: 'Hyperion-Flux',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Features - Enterprise Security Operations Platform"
        description="Discover Hyperion-Flux features: security posture management, APT simulation, compliance automation, architecture visibility, DevSecOps integration, and team collaboration."
        keywords="security features, APT simulation, compliance automation, SBOM, MITRE ATT&CK, security operations"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Everything You Need for
            <span className="text-primary"> Modern Security Operations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hyperion-Flux combines threat simulation, compliance automation, and DevSecOps 
            tooling into a unified platform designed for security professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Security Operations?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of security teams using Hyperion-Flux to strengthen their defenses.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/app/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
