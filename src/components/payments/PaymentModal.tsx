import { useState } from 'react';
import { CreditCard, Wallet, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  price: number;
}

export function PaymentModal({ open, onClose, planId, planName, price }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [usdtPayment, setUsdtPayment] = useState<any>(null);
  const [txHash, setTxHash] = useState('');

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const { url } = await apiClient.billing.createCheckout(planId);
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error('Stripe checkout error:', error);
      setLoading(false);
    }
  };

  const handleUSDTPayment = async () => {
    setLoading(true);
    try {
      const payment = await apiClient.billing.createUSDTPayment(planId);
      setUsdtPayment(payment);
      toast.success('USDT payment details generated');
    } catch (error) {
      toast.error('Failed to generate USDT payment');
      console.error('USDT payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUSDT = async () => {
    if (!txHash || !usdtPayment) {
      toast.error('Please enter transaction hash');
      return;
    }

    setLoading(true);
    try {
      await apiClient.billing.verifyUSDTPayment(usdtPayment.paymentId, txHash);
      toast.success('Payment verified! Your subscription will be activated shortly.');
      onClose();
    } catch (error) {
      toast.error('Failed to verify payment');
      console.error('USDT verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Subscribe to {planName}</DialogTitle>
          <DialogDescription>
            Choose your payment method to upgrade your subscription
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">
              <CreditCard className="mr-2 h-4 w-4" />
              Credit Card
            </TabsTrigger>
            <TabsTrigger value="usdt">
              <Wallet className="mr-2 h-4 w-4" />
              USDT (Crypto)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{planName}</span>
                    <span className="text-2xl font-bold">${price}/mo</span>
                  </div>
                  <Button onClick={handleStripeCheckout} disabled={loading} className="w-full">
                    {loading ? 'Processing...' : 'Continue to Stripe Checkout'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usdt" className="space-y-4">
            {!usdtPayment ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">{planName}</span>
                      <span className="text-2xl font-bold">${price} USDT</span>
                    </div>
                    <Button onClick={handleUSDTPayment} disabled={loading} className="w-full">
                      {loading ? 'Generating...' : 'Generate Payment Address'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center space-y-2">
                    <img 
                      src={usdtPayment.qrCode} 
                      alt="Payment QR Code" 
                      className="mx-auto w-48 h-48 rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground">Scan with your wallet app</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Wallet Address (TRC20)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={usdtPayment.walletAddress} readOnly />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(usdtPayment.walletAddress)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Amount</Label>
                      <Input value={`${usdtPayment.amount} USDT`} readOnly className="mt-1" />
                    </div>

                    <div>
                      <Label>Payment ID (Include in memo)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={usdtPayment.paymentId} readOnly />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(usdtPayment.paymentId)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div className="space-y-1 text-sm">
                        {usdtPayment.instructions?.map((instruction: string, i: number) => (
                          <p key={i}>{instruction}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Hash (after payment)</Label>
                    <Input 
                      placeholder="Enter transaction hash to verify payment"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleVerifyUSDT} disabled={loading || !txHash} className="w-full">
                    {loading ? 'Verifying...' : 'Verify Payment'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Expires in 1 hour • Network: TRC20
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
