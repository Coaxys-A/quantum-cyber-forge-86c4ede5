import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingClient } from '@/lib/billing-client';
import { useToast } from '@/hooks/use-toast';

export function useBilling() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => billingClient.getPlans()
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => billingClient.getCurrentSubscription()
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['usage'],
    queryFn: () => billingClient.getUsageStats()
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => billingClient.getInvoices()
  });

  const createCheckout = useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: 'monthly' | 'yearly' }) =>
      billingClient.createStripeCheckout(planId, billingCycle),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const createPortal = useMutation({
    mutationFn: () => billingClient.createCustomerPortal(),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const createCryptoPayment = useMutation({
    mutationFn: billingClient.createCryptoPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    plans,
    subscription,
    usage,
    invoices,
    isLoading: plansLoading || subscriptionLoading || usageLoading || invoicesLoading,
    createCheckout,
    createPortal,
    createCryptoPayment
  };
}
