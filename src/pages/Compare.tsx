import { Check, X } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useParams } from 'react-router-dom';

const comparisons: Record<string, any> = {
  wiz: {
    name: 'Wiz',
    tagline: 'Cloud Security Platform',
    strengths: ['Cloud-native security', 'Multi-cloud support', 'Agentless scanning'],
    weaknesses: ['Limited on-prem support', 'High cost', 'Complex setup'],
    features: {
      'APT Simulation': false,
      'Compliance Automation': true,
      'SBOM Generation': true,
      'Architecture Visualization': false,
      'AI-Powered Analysis': false,
      'Multi-Tenant': true,
      'DevSecOps Integration': true,
      'Custom Simulations': false,
    },
    pricing: 'Enterprise only ($$$$)',
  },
  'prisma-cloud': {
    name: 'Prisma Cloud',
    tagline: 'Cloud Security by Palo Alto',
    strengths: ['Comprehensive cloud security', 'Network security integration', 'Threat intelligence'],
    weaknesses: ['Expensive', 'Steep learning curve', 'Resource intensive'],
    features: {
      'APT Simulation': false,
      'Compliance Automation': true,
      'SBOM Generation': true,
      'Architecture Visualization': true,
      'AI-Powered Analysis': false,
      'Multi-Tenant': true,
      'DevSecOps Integration': true,
      'Custom Simulations': false,
    },
    pricing: 'Enterprise only ($$$)',
  },
  qualys: {
    name: 'Qualys',
    tagline: 'Vulnerability Management',
    strengths: ['Mature platform', 'Large vulnerability database', 'Global cloud'],
    weaknesses: ['Legacy UI', 'Limited APT simulation', 'Slow updates'],
    features: {
      'APT Simulation': false,
      'Compliance Automation': true,
      'SBOM Generation': false,
      'Architecture Visualization': false,
      'AI-Powered Analysis': false,
      'Multi-Tenant': true,
      'DevSecOps Integration': false,
      'Custom Simulations': false,
    },
    pricing: 'Per asset ($$)',
  },
};

export default function Compare() {
  const { competitor } = useParams<{ competitor: string }>();
  const comparison = competitor ? comparisons[competitor] : null;

  if (!comparison) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Competitor Not Found</h1>
          <Button asChild>
            <Link to="/features">View Features</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hyperionFeatures = {
    'APT Simulation': true,
    'Compliance Automation': true,
    'SBOM Generation': true,
    'Architecture Visualization': true,
    'AI-Powered Analysis': true,
    'Multi-Tenant': true,
    'DevSecOps Integration': true,
    'Custom Simulations': true,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ComparisonPage',
    name: `Hyperion-Flux vs ${comparison.name}`,
    description: `Feature comparison between Hyperion-Flux and ${comparison.name} for enterprise security operations`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Hyperion-Flux vs ${comparison.name} - Feature Comparison`}
        description={`Compare Hyperion-Flux with ${comparison.name}: APT simulation, compliance automation, pricing, and enterprise features.`}
        keywords={`${comparison.name} alternative, security platform comparison, ${comparison.name} vs Hyperion-Flux`}
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Platform Comparison</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hyperion-Flux vs <span className="text-primary">{comparison.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Hyperion-Flux compares to {comparison.name} for enterprise security operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Hyperion-Flux</CardTitle>
              <CardDescription>Next-gen security operations platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Strengths:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Advanced APT simulation with MITRE mapping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>AI-powered security analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Flexible pricing for all team sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Modern UI and developer experience</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold">Starting at $99/month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{comparison.name}</CardTitle>
              <CardDescription>{comparison.tagline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Strengths:</h4>
                <ul className="space-y-1 text-sm">
                  {comparison.strengths.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Limitations:</h4>
                <ul className="space-y-1 text-sm">
                  {comparison.weaknesses.map((weakness: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive mt-0.5" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold">{comparison.pricing}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of key features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Hyperion-Flux</th>
                    <th className="text-center py-3 px-4">{comparison.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(hyperionFeatures).map(([feature, _]) => (
                    <tr key={feature} className="border-b">
                      <td className="py-3 px-4">{feature}</td>
                      <td className="text-center py-3 px-4">
                        {hyperionFeatures[feature as keyof typeof hyperionFeatures] ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {comparison.features[feature] ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make the Switch?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join security teams who chose Hyperion-Flux for its advanced APT simulation, 
            AI-powered analysis, and flexible pricing.
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
