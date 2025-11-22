import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Shield, FileText, CheckCircle, AlertCircle, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Framework {
  id: string;
  name: string;
  description: string;
  coverage: number;
  controls: number;
  implemented: number;
}

export default function CompliancePage() {
  const { profile } = useAuth();
  const [frameworks, setFrameworks] = useState<Framework[]>([
    { id: 'iso27001', name: 'ISO 27001', description: 'Information security management', coverage: 0, controls: 114, implemented: 0 },
    { id: 'soc2', name: 'SOC 2 Type II', description: 'Trust service principles', coverage: 0, controls: 64, implemented: 0 },
    { id: 'nist', name: 'NIST CSF', description: 'Cybersecurity Framework', coverage: 0, controls: 108, implemented: 0 },
    { id: 'cis', name: 'CIS Controls', description: 'Critical security controls', coverage: 0, controls: 153, implemented: 0 }
  ]);
  const [selectedFramework, setSelectedFramework] = useState('iso27001');
  const [loading, setLoading] = useState(true);
  const [controls, setControls] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
    loadCompliance();
  }, [profile]);

  const checkAccess = async () => {
    if (!profile?.tenant_id) return;
    
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan:plans(*)')
        .eq('tenant_id', profile.tenant_id)
        .eq('status', 'active')
        .single();

      const plan = subscription?.plan as any;
      const hasFullAccess = ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'].includes(plan?.tier);
      setHasAccess(hasFullAccess);
    } catch (error) {
      console.error('Access check failed:', error);
    }
  };

  const loadCompliance = async () => {
    if (!profile?.tenant_id) return;

    try {
      const { data: controlsData } = await supabase
        .from('controls')
        .select('*')
        .eq('tenant_id', profile.tenant_id);

      setControls(controlsData || []);

      // Calculate coverage based on implemented controls
      const updatedFrameworks = frameworks.map(fw => {
        const implementedCount = Math.floor(Math.random() * fw.controls * 0.6); // Demo data
        return {
          ...fw,
          implemented: implementedCount,
          coverage: Math.round((implementedCount / fw.controls) * 100)
        };
      });
      
      setFrameworks(updatedFrameworks);
    } catch (error) {
      console.error('Failed to load compliance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async (frameworkId: string) => {
    if (!hasAccess) {
      toast.error('Upgrade to Pro or higher to use AI compliance analysis');
      return;
    }

    toast.info('AI analysis started...', { description: 'Analyzing your compliance posture' });
    
    // Simulate AI analysis
    setTimeout(() => {
      toast.success('Analysis complete', { 
        description: 'Found 12 gaps and 8 recommendations' 
      });
    }, 2000);
  };

  const currentFramework = frameworks.find(f => f.id === selectedFramework);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">
            Track compliance with security frameworks and standards
          </p>
        </div>
        {!hasAccess && (
          <Badge variant="outline" className="gap-2">
            <Lock className="h-3 w-3" />
            Upgrade for full access
          </Badge>
        )}
      </div>

      {!hasAccess && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Demo Mode</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro or higher for full compliance features
                </p>
              </div>
            </div>
            <Button>Upgrade Plan</Button>
          </CardContent>
        </Card>
      )}

      {/* Framework Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {frameworks.map((framework) => (
          <Card 
            key={framework.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              selectedFramework === framework.id ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedFramework(framework.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{framework.name}</CardTitle>
              <CardDescription className="text-xs">{framework.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-bold">{framework.coverage}%</span>
                </div>
                <Progress value={framework.coverage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{framework.implemented} implemented</span>
                  <span>{framework.controls} total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Framework Details */}
      {currentFramework && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {currentFramework.name} Controls
                </CardTitle>
                <CardDescription>
                  Manage and track implementation status
                </CardDescription>
              </div>
              <Button
                onClick={() => handleAIAnalysis(currentFramework.id)}
                disabled={!hasAccess}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Total Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentFramework.controls}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Implemented</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">{currentFramework.implemented}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-500">
                        {currentFramework.controls - currentFramework.implemented}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Implementation Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Access Control</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cryptography</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Operations Security</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Communications Security</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <Progress value={80} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="controls" className="mt-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Control {currentFramework.id.toUpperCase()}.{i}</p>
                            <p className="text-sm text-muted-foreground">
                              Sample control description for framework compliance
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Implemented</Badge>
                      </CardContent>
                    </Card>
                  ))}
                  {[6, 7, 8].map((i) => (
                    <Card key={i} className="opacity-60">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Control {currentFramework.id.toUpperCase()}.{i}</p>
                            <p className="text-sm text-muted-foreground">
                              Pending implementation
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="mt-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Evidence Document {i}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {Math.floor(Math.random() * 30)} days ago
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </CardContent>
                    </Card>
                  ))}
                  {!hasAccess && (
                    <Card className="border-dashed">
                      <CardContent className="p-8 text-center">
                        <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Evidence management available in Pro plan
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
