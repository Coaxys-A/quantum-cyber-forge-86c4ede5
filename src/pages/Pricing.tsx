import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Pricing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading plans',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan: any) => {
    return billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
  };

  const getUsdtPrice = (plan: any) => {
    return billingPeriod === 'monthly' ? plan.usdt_price_monthly : plan.usdt_price_yearly;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Hyperion-Flux</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link to="/app/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4">Flexible Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose the Perfect Plan for Your Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Scale from startup to enterprise with transparent pricing and no hidden fees
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const features = Array.isArray(plan.features) ? plan.features : [];
              const isPopular = plan.tier === 'PRO';

              return (
                <Card
                  key={plan.id}
                  className={`relative border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in ${
                    isPopular ? 'border-primary shadow-lg scale-105' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-foreground">
                          ${getPrice(plan)}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      {plan.tier !== 'FREE' && (
                        <div className="mt-2 text-sm">
                          or {getUsdtPrice(plan)} USDT
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/app/register" className="w-full">
                      <Button
                        className={`w-full group ${isPopular ? '' : 'variant="outline"'}`}
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Payment Methods */}
          <div className="mt-16 text-center animate-fade-in">
            <h3 className="text-2xl font-bold mb-8">Flexible Payment Options</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Credit Card (Stripe)</CardTitle>
                  <CardDescription>
                    Pay securely with credit card or debit card through Stripe
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>USDT (TRC20)</CardTitle>
                  <CardDescription>
                    Pay with USDT cryptocurrency on the TRON network
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans later?</CardTitle>
                  <CardDescription>
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                  <CardDescription>
                    We accept all major credit cards through Stripe, and USDT cryptocurrency (TRC20) for crypto payments.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                  <CardDescription>
                    Yes! All paid plans include a 14-day free trial. No credit card required to start.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens after my trial ends?</CardTitle>
                  <CardDescription>
                    Your account will automatically downgrade to the Free plan if you don't choose a paid plan. No charges apply unless you explicitly subscribe.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}