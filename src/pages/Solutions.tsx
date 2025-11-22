import { Building2, Code, FileCheck, Shield } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const solutions = [
  {
    icon: Shield,
    title: 'Security Operations Center (SOC)',
    description: 'Empower your SOC team with advanced threat simulation, continuous monitoring, and automated response capabilities.',
    useCases: [
      'Threat hunting and detection',
      'Incident response automation',
      'Security metrics and reporting',
      'Team training with APT simulations',
    ],
  },
  {
    icon: FileCheck,
    title: 'Compliance & Governance',
    description: 'Streamline compliance with automated evidence collection, control mapping, and audit-ready documentation.',
    useCases: [
      'ISO27001 certification',
      'SOC2 Type II audits',
      'NIST framework implementation',
      'Continuous compliance monitoring',
    ],
  },
  {
    icon: Code,
    title: 'DevSecOps Transformation',
    description: 'Integrate security into your development pipeline with SBOM generation, dependency scanning, and vulnerability management.',
    useCases: [
      'Shift-left security',
      'CI/CD pipeline security',
      'Container and cloud security',
      'Supply chain risk management',
    ],
  },
  {
    icon: Building2,
    title: 'Enterprise Risk Management',
    description: 'Comprehensive risk identification, assessment, and mitigation planning with executive-level dashboards.',
    useCases: [
      'Risk register management',
      'Third-party risk assessment',
      'Business impact analysis',
      'Executive reporting',
    ],
  },
];

export default function Solutions() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Solutions',
    description: 'Security solutions for SOC teams, compliance officers, DevSecOps engineers, and enterprise risk managers',
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Solutions - Security for Every Team"
        description="Hyperion-Flux solutions for SOC operations, compliance management, DevSecOps transformation, and enterprise risk management."
        keywords="SOC solutions, compliance automation, DevSecOps, risk management, security operations"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Solutions for Every
            <span className="text-primary"> Security Challenge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're managing a SOC, ensuring compliance, transforming DevSecOps, 
            or overseeing enterprise risk, Hyperion-Flux has you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{solution.title}</CardTitle>
                <CardDescription className="text-base">{solution.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-3">Key Use Cases:</h4>
                <ul className="space-y-2">
                  {solution.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our enterprise team can work with you to design a tailored security operations 
            platform that fits your unique requirements and integrations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Contact Sales</Link>
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
