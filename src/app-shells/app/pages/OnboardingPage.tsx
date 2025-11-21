import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Settings, Users, CheckCircle, Shield, Network, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Organization
  const [orgName, setOrgName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Step 2: First Module
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleCategory, setModuleCategory] = useState('');
  
  // Step 3: First Risk
  const [riskTitle, setRiskTitle] = useState('');
  const [riskSeverity, setRiskSeverity] = useState('');
  
  // Step 4: Architecture Node
  const [componentName, setComponentName] = useState('');
  const [componentType, setComponentType] = useState('');

  const progress = (step / 5) * 100;

  const handleStep1 = async () => {
    if (!orgName.trim()) {
      toast.error('Please enter organization name');
      return;
    }
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!moduleName.trim()) {
      toast.error('Please enter module name');
      return;
    }
    
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.tenant_id) throw new Error('No tenant');

      await supabase.from('modules').insert([{
        name: moduleName,
        slug: moduleName.toLowerCase().replace(/\s+/g, '-'),
        description: moduleDescription,
        category: (moduleCategory || 'APPLICATION') as any,
        tenant_id: profile.tenant_id,
        status: 'STABLE' as any,
      }]);

      toast.success('First module created!');
      setStep(3);
    } catch (error) {
      toast.error('Failed to create module');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (!riskTitle.trim()) {
      toast.error('Please enter risk title');
      return;
    }
    
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.tenant_id) throw new Error('No tenant');

      await supabase.from('risks').insert([{
        title: riskTitle,
        severity: (riskSeverity || 'MEDIUM') as any,
        status: 'IDENTIFIED' as any,
        tenant_id: profile.tenant_id,
      }]);

      toast.success('First risk created!');
      setStep(4);
    } catch (error) {
      toast.error('Failed to create risk');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep4 = async () => {
    if (!componentName.trim()) {
      toast.error('Please enter component name');
      return;
    }
    
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.tenant_id) throw new Error('No tenant');

      await supabase.from('components').insert([{
        name: componentName,
        type: (componentType || 'SERVICE') as any,
        tenant_id: profile.tenant_id,
        health_status: 'HEALTHY' as any,
      }]);

      toast.success('First component created!');
      setStep(5);
    } catch (error) {
      toast.error('Failed to create component');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    toast.success('Welcome to Hyperion-Flux!');
    navigate('/app/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Welcome to Hyperion-Flux
          </CardTitle>
          <CardDescription>Let's set up your cyber intelligence platform</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Building2 className="h-5 w-5 text-primary" />
                Organization Setup
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleStep1} className="w-full">
                Continue
              </Button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Settings className="h-5 w-5 text-primary" />
                Create Your First Module
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleName">Module Name *</Label>
                  <Input
                    id="moduleName"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="User Authentication Service"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moduleDescription">Description</Label>
                  <Textarea
                    id="moduleDescription"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    placeholder="Handles user login, registration, and session management"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moduleCategory">Category</Label>
                  <Select value={moduleCategory} onValueChange={setModuleCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLICATION">Application</SelectItem>
                      <SelectItem value="SECURITY">Security</SelectItem>
                      <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                      <SelectItem value="NETWORK">Network</SelectItem>
                      <SelectItem value="DATA">Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                  Back
                </Button>
                <Button onClick={handleStep2} disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Continue'}
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Identify Your First Risk
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riskTitle">Risk Title *</Label>
                  <Input
                    id="riskTitle"
                    value={riskTitle}
                    onChange={(e) => setRiskTitle(e.target.value)}
                    placeholder="Unauthorized API Access"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskSeverity">Severity</Label>
                  <Select value={riskSeverity} onValueChange={setRiskSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                  Back
                </Button>
                <Button onClick={handleStep3} disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Continue'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Network className="h-5 w-5 text-primary" />
                Map Your First Component
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="componentName">Component Name *</Label>
                  <Input
                    id="componentName"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    placeholder="API Gateway"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="componentType">Type</Label>
                  <Select value={componentType} onValueChange={setComponentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SERVICE">Service</SelectItem>
                      <SelectItem value="DATABASE">Database</SelectItem>
                      <SelectItem value="API">API</SelectItem>
                      <SelectItem value="FRONTEND">Frontend</SelectItem>
                      <SelectItem value="BACKEND">Backend</SelectItem>
                      <SelectItem value="NETWORK">Network</SelectItem>
                      <SelectItem value="STORAGE">Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep(3)} variant="outline" className="w-full">
                  Back
                </Button>
                <Button onClick={handleStep4} disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Continue'}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">You're All Set!</h3>
                <p className="text-muted-foreground">
                  Your Hyperion-Flux platform is ready. You've created:
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Organization: {orgName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Module: {moduleName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Risk: {riskTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Component: {componentName}</span>
                </div>
              </div>
              <Button onClick={handleComplete} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
