import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, PlayCircle } from 'lucide-react';

export default function APTScenarioBuilderPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actor_profile_id: '',
    attack_vector: 'phishing',
    target_components: [] as string[],
    objectives: [] as string[],
    stealth_mode: true,
  });

  useEffect(() => {
    loadActors();
  }, []);

  const loadActors = async () => {
    const { data } = await supabase
      .from('apt_actor_profiles')
      .select('*')
      .order('name');
    
    if (data) setActors(data);
  };

  const handleSave = async () => {
    if (!profile?.tenant_id) return;
    if (!formData.name || !formData.actor_profile_id) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('apt_scenarios')
      .insert({
        tenant_id: profile.tenant_id,
        ...formData,
        config: { stealth_mode: formData.stealth_mode }
      });

    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Scenario created successfully'
      });
      navigate('/app/simulations');
    }
  };

  const handleRunNow = async () => {
    if (!profile?.tenant_id) return;
    setLoading(true);

    // First save the scenario
    const { data: scenario, error: saveError } = await supabase
      .from('apt_scenarios')
      .insert({
        tenant_id: profile.tenant_id,
        ...formData,
        config: { stealth_mode: formData.stealth_mode }
      })
      .select()
      .single();

    if (saveError || !scenario) {
      setLoading(false);
      toast({
        title: 'Error',
        description: saveError?.message || 'Failed to create scenario',
        variant: 'destructive'
      });
      return;
    }

    // Run the simulation
    const { data, error } = await supabase.functions.invoke('apt-run', {
      body: {
        scenario_id: scenario.id,
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
    } else if (data?.run_id) {
      toast({
        title: 'Simulation Started',
        description: 'APT simulation is now running'
      });
      navigate(`/app/simulations/${data.run_id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/app/simulations')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Simulations
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create APT Scenario</CardTitle>
          <CardDescription>
            Build a custom adversary simulation using real-world TTPs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., APT28 Credential Harvest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the simulation objectives and expected outcomes"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actor">Threat Actor *</Label>
            <Select
              value={formData.actor_profile_id}
              onValueChange={(value) => setFormData({ ...formData, actor_profile_id: value })}
            >
              <SelectTrigger id="actor">
                <SelectValue placeholder="Select threat actor" />
              </SelectTrigger>
              <SelectContent>
                {actors.map((actor) => (
                  <SelectItem key={actor.id} value={actor.id}>
                    {actor.name} - {actor.sophistication_level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vector">Attack Vector</Label>
            <Select
              value={formData.attack_vector}
              onValueChange={(value) => setFormData({ ...formData, attack_vector: value })}
            >
              <SelectTrigger id="vector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="watering_hole">Watering Hole</SelectItem>
                <SelectItem value="supply_chain">Supply Chain</SelectItem>
                <SelectItem value="zero_day">Zero Day Exploit</SelectItem>
                <SelectItem value="stolen_credentials">Stolen Credentials</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objectives</Label>
            <Textarea
              id="objectives"
              placeholder="e.g., data exfiltration, persistence, lateral movement (comma-separated)"
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value.split(',').map(s => s.trim()) })}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stealth">Stealth Mode</Label>
              <p className="text-sm text-muted-foreground">
                Lower detection probability, slower progression
              </p>
            </div>
            <Switch
              id="stealth"
              checked={formData.stealth_mode}
              onCheckedChange={(checked) => setFormData({ ...formData, stealth_mode: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={loading} variant="outline" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Scenario
            </Button>
            <Button onClick={handleRunNow} disabled={loading} className="flex-1">
              <PlayCircle className="h-4 w-4 mr-2" />
              Run Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
