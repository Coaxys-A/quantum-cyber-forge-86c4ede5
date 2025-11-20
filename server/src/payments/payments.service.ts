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

  async createCheckoutSession(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.stripePriceId) {
      throw new Error('Plan not found or invalid');
    }

    const session = await this.stripeService.createCheckoutSession(
      user.email,
      plan.stripePriceId,
    );

    return { url: session.url };
  }

  async getUserSubscription(userId: string, tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        userIdBillingOwner: userId,
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
}
