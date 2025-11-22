import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBilling } from '@/hooks/useBilling';
import { CryptoPaymentModal } from '@/components/billing/CryptoPaymentModal';
import { CreditCard, Bitcoin, Download, ExternalLink, Zap, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingPage() {
  const { plans, subscription, usage, invoices, isLoading, createCheckout, createPortal } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const handleUpgrade = (plan: any, cycle: 'monthly' | 'yearly', method: 'stripe' | 'crypto') => {
    setSelectedPlan(plan);
    setBillingCycle(cycle);
    
    if (method === 'stripe') {
      createCheckout.mutate({ planId: plan.id, billingCycle: cycle });
    } else {
      setShowCryptoModal(true);
    }
  };

  const getUsagePercentage = (type: string, limit: number | null) => {
    if (!limit || limit === -1) return 0;
    const used = usage?.[type] || 0;
    return Math.min((used / limit) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan;
  const isActive = subscription?.status === 'active';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Subscription */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${subscription.billing_cycle === 'yearly' ? currentPlan.price_yearly : currentPlan.price_monthly}
                      /{subscription.billing_cycle === 'yearly' ? 'year' : 'month'}
                    </p>
                  </div>
                  <Badge variant={isActive ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </div>

                {subscription.current_period_end && (
                  <div className="text-sm text-muted-foreground">
                    Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => createPortal.mutate()}
                    disabled={createPortal.isPending}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active subscription</p>
                <Button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                  Choose a Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Current month usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan && (
              <>
                {currentPlan.limits.max_ai_requests && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Requests</span>
                      <span className="text-muted-foreground">
                        {usage?.AI_REQUEST || 0} / {currentPlan.limits.max_ai_requests === -1 ? '∞' : currentPlan.limits.max_ai_requests}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage('AI_REQUEST', currentPlan.limits.max_ai_requests)} />
                  </div>
                )}

                {currentPlan.limits.max_simulations && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Simulations</span>
                      <span className="text-muted-foreground">
                        {usage?.SIMULATION || 0} / {currentPlan.limits.max_simulations === -1 ? '∞' : currentPlan.limits.max_simulations}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage('SIMULATION', currentPlan.limits.max_simulations)} />
                  </div>
                )}

                {currentPlan.limits.max_projects && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projects</span>
                      <span className="text-muted-foreground">
                        {usage?.PROJECT || 0} / {currentPlan.limits.max_projects === -1 ? '∞' : currentPlan.limits.max_projects}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage('PROJECT', currentPlan.limits.max_projects)} />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <div id="plans">
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={billingCycle} onValueChange={(v: any) => setBillingCycle(v)} className="mb-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly
                  <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans?.map((plan) => {
                const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
                const usdtPrice = billingCycle === 'yearly' ? plan.usdt_price_yearly : plan.usdt_price_monthly;
                const isCurrent = currentPlan?.id === plan.id;

                return (
                  <Card key={plan.id} className={isCurrent ? 'border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{plan.name}</CardTitle>
                        {isCurrent && <Badge>Current</Badge>}
                      </div>
                      <div className="text-3xl font-bold">
                        ${price}
                        <span className="text-base font-normal text-muted-foreground">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {(plan.features as string[])?.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {!isCurrent && (
                        <div className="space-y-2">
                          <Button
                            onClick={() => handleUpgrade(plan, billingCycle, 'stripe')}
                            disabled={createCheckout.isPending}
                            className="w-full"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Subscribe with Card
                          </Button>
                          
                          {usdtPrice && (
                            <Button
                              onClick={() => handleUpgrade(plan, billingCycle, 'crypto')}
                              variant="outline"
                              className="w-full"
                            >
                              <Bitcoin className="h-4 w-4 mr-2" />
                              Pay with USDT
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Your billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">
                        ${(invoice.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crypto Payment Modal */}
      {selectedPlan && showCryptoModal && (
        <CryptoPaymentModal
          open={showCryptoModal}
          onClose={() => {
            setShowCryptoModal(false);
            setSelectedPlan(null);
          }}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          priceMonthly={selectedPlan.price_monthly}
          priceYearly={selectedPlan.price_yearly}
          usdtPriceMonthly={selectedPlan.usdt_price_monthly}
          usdtPriceYearly={selectedPlan.usdt_price_yearly}
        />
      )}
    </div>
  );
}
