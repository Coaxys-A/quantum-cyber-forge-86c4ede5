import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, Clock, XCircle } from 'lucide-react';
import { billingClient } from '@/lib/billing-client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface CryptoPaymentModalProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  priceMonthly: number;
  priceYearly: number;
  usdtPriceMonthly: number | null;
  usdtPriceYearly: number | null;
}

export function CryptoPaymentModal({
  open,
  onClose,
  planId,
  planName,
  priceMonthly,
  priceYearly,
  usdtPriceMonthly,
  usdtPriceYearly
}: CryptoPaymentModalProps) {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [network, setNetwork] = useState<'TRON' | 'ETHEREUM' | 'BSC'>('TRON');
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const price = billingCycle === 'monthly' 
    ? (usdtPriceMonthly || priceMonthly) 
    : (usdtPriceYearly || priceYearly);

  const createPayment = async () => {
    setLoading(true);
    try {
      const result = await billingClient.createCryptoPayment({
        plan_id: planId,
        billing_cycle: billingCycle,
        network
      });
      setPayment(result);
      
      // Start polling for payment status
      const interval = setInterval(async () => {
        try {
          const updated = await billingClient.checkCryptoPayment(result.id);
          setPayment(updated);
          
          if (updated.status === 'CONFIRMED') {
            clearInterval(interval);
            toast({
              title: 'Payment Confirmed',
              description: 'Your subscription has been activated!'
            });
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          } else if (updated.status === 'EXPIRED' || updated.status === 'CANCELLED') {
            clearInterval(interval);
          }
        } catch (error) {
          // Continue polling
        }
      }, 10000); // Check every 10 seconds

      // Clear interval after 30 minutes
      setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!payment) return;
    setChecking(true);
    try {
      const updated = await billingClient.checkCryptoPayment(payment.id);
      setPayment(updated);
      
      if (updated.status === 'CONFIRMED') {
        toast({
          title: 'Payment Confirmed',
          description: 'Your subscription has been activated!'
        });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else if (updated.status === 'PENDING') {
        toast({
          title: 'Still Pending',
          description: 'Payment not yet confirmed. Please wait.'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`
    });
  };

  const getStatusIcon = () => {
    switch (payment?.status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'EXPIRED':
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (payment?.status) {
      case 'CONFIRMED':
        return 'default';
      case 'EXPIRED':
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pay with Cryptocurrency</DialogTitle>
          <DialogDescription>
            Complete your {planName} subscription using USDT
          </DialogDescription>
        </DialogHeader>

        {!payment ? (
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Billing Cycle</label>
              <Select value={billingCycle} onValueChange={(v: any) => setBillingCycle(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">
                    Monthly - ${usdtPriceMonthly || priceMonthly} USDT
                  </SelectItem>
                  <SelectItem value="yearly">
                    Yearly - ${usdtPriceYearly || priceYearly} USDT
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Network</label>
              <Select value={network} onValueChange={(v: any) => setNetwork(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRON">TRON (TRC20)</SelectItem>
                  <SelectItem value="ETHEREUM">Ethereum (ERC20)</SelectItem>
                  <SelectItem value="BSC">BNB Smart Chain (BEP20)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold">${price} USDT</span>
              </div>
              
              <Button 
                onClick={createPayment} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Generating Payment...' : 'Generate Payment Address'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-medium">Payment Status</span>
              </div>
              <Badge variant={getStatusColor() as any}>
                {payment.status}
              </Badge>
            </div>

            {payment.status === 'PENDING' && (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Payment Address</label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-3 bg-muted rounded text-sm break-all">
                        {payment.address}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(payment.address, 'Address')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount</label>
                      <div className="p-3 bg-muted rounded">
                        <span className="font-mono">{payment.amount_token} USDT</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Network</label>
                      <div className="p-3 bg-muted rounded">
                        <span className="font-mono">{payment.network}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      <strong>Important:</strong> Send exactly {payment.amount_token} USDT to the address above. 
                      Payment expires in {new Date(payment.expires_at).toLocaleString()}.
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={checkStatus} 
                  disabled={checking}
                  className="w-full"
                  variant="outline"
                >
                  {checking ? 'Checking...' : 'Check Payment Status'}
                </Button>
              </>
            )}

            {payment.status === 'CONFIRMED' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>Success!</strong> Your payment has been confirmed and your subscription is now active.
                </p>
              </div>
            )}

            {(payment.status === 'EXPIRED' || payment.status === 'CANCELLED') && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Payment {payment.status.toLowerCase()}</strong>. Please create a new payment request.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
