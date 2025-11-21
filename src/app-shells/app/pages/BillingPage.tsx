import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Download } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { toast } from 'sonner';

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      const [subData, plansData] = await Promise.all([
        apiClient.billing.subscription(),
        apiClient.billing.plans(),
      ]);
      setSubscription(subData);
      setPlans(plansData);
    } catch (error) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing details</p>
        </div>

        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your active plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{subscription.plan?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Status: <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${subscription.plan?.price_monthly}/mo</p>
                </div>
              </div>
              
              {subscription.invoices && subscription.invoices.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Recent Invoices</h4>
                  <div className="space-y-2">
                    {subscription.invoices.slice(0, 3).map((invoice: any) => (
                      <div key={invoice.id} className="flex items-center justify-between text-sm">
                        <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                        <span>${invoice.amount}</span>
                        <Badge variant="outline">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.plan?.id === plan.id;
              const features = plan.features || [];
              
              return (
                <Card key={plan.id} className={isCurrentPlan ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && <Badge>Current</Badge>}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">${plan.price_monthly}</span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handleUpgrade(plan)}
                      className="w-full"
                      disabled={isCurrentPlan}
                      variant={isCurrentPlan ? 'outline' : 'default'}
                    >
                      {isCurrentPlan ? (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Current Plan
                        </>
                      ) : (
                        'Upgrade Now'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          price={selectedPlan.price_monthly}
        />
      )}
    </>
  );
}
