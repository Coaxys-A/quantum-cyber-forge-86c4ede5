import { Building2, Landmark, Heart, Shield, Code, Factory } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';

const industries: Record<string, any> = {
  fintech: {
    icon: Landmark,
    name: 'Financial Services',
    description: 'Security and compliance for banking, fintech, and financial institutions',
    challenges: [
      'PCI-DSS compliance',
      'Transaction security',
      'Fraud detection',
      'Regulatory reporting',
    ],
    solutions: [
      'Automated compliance audits',
      'Real-time threat detection',
      'Risk scoring and monitoring',
      'Secure architecture design',
    ],
  },
  healthcare: {
    icon: Heart,
    name: 'Healthcare',
    description: 'HIPAA-compliant security for healthcare providers and medical technology',
    challenges: [
      'HIPAA compliance',
      'Patient data protection',
      'Medical device security',
      'Ransomware protection',
    ],
    solutions: [
      'HIPAA compliance automation',
      'PHI data encryption',
      'Medical IoT security',
      'Incident response planning',
    ],
  },
  saas: {
    icon: Code,
    name: 'SaaS & Technology',
    description: 'Security operations for SaaS platforms and technology companies',
    challenges: [
      'SOC2 compliance',
      'Multi-tenant security',
      'API security',
      'DevSecOps integration',
    ],
    solutions: [
      'SOC2 automation',
      'Tenant isolation testing',
      'API security testing',
      'SBOM and dependency management',
    ],
  },
  enterprise: {
    icon: Building2,
    name: 'Enterprise',
    description: 'Comprehensive security for large enterprises and corporations',
    challenges: [
      'Complex infrastructure',
      'Multiple compliance frameworks',
      'Large attack surface',
      'Third-party risk',
    ],
    solutions: [
      'Architecture visualization',
      'Multi-framework compliance',
      'APT simulation',
      'Supply chain security',
    ],
  },
  government: {
    icon: Shield,
    name: 'Government & Defense',
    description: 'Security for government agencies and defense contractors',
    challenges: [
      'NIST compliance',
      'Zero-trust architecture',
      'Advanced threats',
      'Classified data protection',
    ],
    solutions: [
      'NIST framework implementation',
      'Zero-trust validation',
      'APT defense simulation',
      'Air-gapped deployment options',
    ],
  },
  manufacturing: {
    icon: Factory,
    name: 'Manufacturing',
    description: 'OT/IT security for manufacturing and industrial operations',
    challenges: [
      'OT/IT convergence',
      'ICS/SCADA security',
      'Supply chain attacks',
      'Production downtime',
    ],
    solutions: [
      'OT security monitoring',
      'ICS vulnerability assessment',
      'Supply chain risk management',
      'Zero-downtime security updates',
    ],
  },
};

export default function Industries() {
  const { industry } = useParams<{ industry: string }>();
  const industryData = industry ? industries[industry] : null;

  if (!industryData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Industry Not Found</h1>
          <Button asChild>
            <Link to="/solutions">View Solutions</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = industryData.icon;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${industryData.name} Security Solutions`,
    description: industryData.description,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${industryData.name} Security Solutions - Hyperion-Flux`}
        description={`${industryData.description}. Comprehensive security operations for ${industryData.name.toLowerCase()}.`}
        keywords={`${industryData.name} security, ${industry} cybersecurity, compliance automation`}
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Security for <span className="text-primary">{industryData.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {industryData.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Industry Challenges</CardTitle>
              <CardDescription>
                Key security challenges facing {industryData.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {industryData.challenges.map((challenge: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-2" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hyperion-Flux Solutions</CardTitle>
              <CardDescription>
                How we help secure {industryData.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {industryData.solutions.map((solution: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Operations?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join {industryData.name.toLowerCase()} organizations using Hyperion-Flux to 
            strengthen their security posture and ensure compliance.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/app/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
