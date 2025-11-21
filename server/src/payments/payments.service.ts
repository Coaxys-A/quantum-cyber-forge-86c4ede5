import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async getPlans() {
    return this.prisma.plan.findMany();
  }

  async createCheckoutSession(userId: string, tenantId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.stripePriceIdMonthly) {
      throw new Error('Plan not found or invalid');
    }

    const session = await this.stripeService.createCheckoutSession(
      user.email,
      plan.stripePriceIdMonthly,
      tenantId,
    );

    return { url: session.url };
  }

  async createUSDTPayment(userId: string, tenantId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.usdtPriceMonthly) {
      throw new Error('Plan not found or invalid');
    }

    // Generate USDT payment details
    const walletAddress = process.env.USDT_WALLET_ADDRESS || 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXx';
    const amount = plan.usdtPriceMonthly;
    const paymentId = `USDT-${Date.now()}-${tenantId}`;

    return {
      paymentId,
      walletAddress,
      amount,
      currency: 'USDT',
      network: 'TRC20',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${walletAddress}&size=300x300`,
      instructions: [
        'Send the exact amount to the wallet address',
        'Include the payment ID in the memo/note',
        'Wait for blockchain confirmation',
        'Your subscription will be activated automatically',
      ],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
  }

  async verifyUSDTPayment(paymentId: string, txHash: string) {
    // In production, verify the transaction on the blockchain
    // For now, simulate verification
    return {
      paymentId,
      txHash,
      verified: true,
      status: 'confirmed',
      confirmations: 6,
      message: 'Payment verified successfully',
    };
  }

  async getUserSubscription(userId: string, tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        billingOwnerId: userId,
        tenantId,
      },
      include: { plan: true, invoices: true },
    });
  }

  async getTenantSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true, invoices: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object);
        break;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: any) {
    const tenantId = session.metadata.tenantId;
    const userId = session.metadata.userId;
    const planId = session.metadata.planId;

    await this.prisma.subscription.create({
      data: {
        tenantId,
        billingOwnerId: userId,
        planId,
        stripeSubscriptionId: session.subscription,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  private async handleSubscriptionUpdated(subscription: any) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: any) {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        cancelAt: new Date(),
      },
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
    });

    if (subscription) {
      await this.prisma.invoice.create({
        data: {
          subscriptionId: subscription.id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'paid',
          paidAt: new Date(invoice.status_transitions.paid_at * 1000),
        },
      });
    }
  }
}
