import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, PlayCircle } from 'lucide-react';

export default function DevSecOpsNewScanPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    target_type: 'repository',
    target_identifier: '',
    scan_types: [] as string[],
  });

  const scanTypeOptions = [
    { value: 'sast', label: 'SAST - Static Analysis' },
    { value: 'sca', label: 'SCA - Dependency Scanning' },
    { value: 'secrets', label: 'Secret Detection' },
    { value: 'iac', label: 'IaC Scanning' },
    { value: 'dast', label: 'DAST - Dynamic Analysis' },
    { value: 'sbom', label: 'SBOM Generation' },
  ];

  const handleScanTypeToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      scan_types: prev.scan_types.includes(value)
        ? prev.scan_types.filter(t => t !== value)
        : [...prev.scan_types, value]
    }));
  };

  const handleRun = async () => {
    if (!profile?.tenant_id) return;
    if (!formData.name || !formData.target_identifier || formData.scan_types.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and select at least one scan type',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.functions.invoke('devsecops-scan', {
      body: {
        ...formData,
        tenant_id: profile.tenant_id
      }
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data?.scan_id) {
      toast({
        title: 'Scan Started',
        description: `Found ${data.findings_count} findings`
      });
      navigate(`/app/devsecops/${data.scan_id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/app/devsecops')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to DevSecOps
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Security Scan</CardTitle>
          <CardDescription>
            Configure and run a comprehensive security scan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Scan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Production API Security Scan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_type">Target Type</Label>
            <Select
              value={formData.target_type}
              onValueChange={(value) => setFormData({ ...formData, target_type: value })}
            >
              <SelectTrigger id="target_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repository">Repository</SelectItem>
                <SelectItem value="container">Container Image</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="pipeline">CI/CD Pipeline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Identifier *</Label>
            <Input
              id="target"
              value={formData.target_identifier}
              onChange={(e) => setFormData({ ...formData, target_identifier: e.target.value })}
              placeholder="e.g., github.com/org/repo, image:tag, or URL"
            />
          </div>

          <div className="space-y-3">
            <Label>Scan Types * (select at least one)</Label>
            {scanTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={formData.scan_types.includes(option.value)}
                  onCheckedChange={() => handleScanTypeToggle(option.value)}
                />
                <Label
                  htmlFor={option.value}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleRun} disabled={loading} className="w-full" size="lg">
            <PlayCircle className="h-4 w-4 mr-2" />
            Run Scan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
