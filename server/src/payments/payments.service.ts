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
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });

    const session = await this.stripeService.createCheckoutSession(
      user.email,
      plan.stripePriceId,
    );

    return { url: session.url };
  }

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true, invoices: true },
    });
  }
}
