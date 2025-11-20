import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');

  const handleComplete = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Hyperion-Flux</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter your organization name"
                />
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Continue
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <p>Configure your preferences</p>
              <Button onClick={() => setStep(3)} className="w-full">
                Continue
              </Button>
            </>
          )}
          
          {step === 3 && (
            <>
              <p>Invite team members (optional)</p>
              <Button onClick={handleComplete} className="w-full">
                Get Started
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
