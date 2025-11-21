import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const subscription = await this.prisma.subscription.create({
      data: {
        tenantId,
        billingOwnerId: userId,
        planId: createSubscriptionDto.planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        plan: true,
      },
    });

    return subscription;
  }

  async findAll(tenantId: string) {
    return this.prisma.subscription.findMany({
      where: { tenantId },
      include: {
        plan: true,
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        invoices: true,
      },
    });

    if (!subscription || subscription.tenantId !== tenantId) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async findByTenant(tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      include: {
        plan: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscription;
  }

  async update(
    id: string,
    tenantId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.findOne(id, tenantId);

    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
      include: {
        plan: true,
      },
    });
  }

  async cancel(id: string, tenantId: string) {
    const subscription = await this.findOne(id, tenantId);

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'canceled',
        cancelAt: new Date(),
      },
    });
  }

  async checkPlanLimits(tenantId: string, resource: string, count: number): Promise<boolean> {
    const subscription = await this.findByTenant(tenantId);
    
    if (!subscription || !subscription.plan) {
      return false;
    }

    const limits = subscription.plan.limits as any;
    if (!limits || !limits[resource]) {
      return true; // No limit defined
    }

    return count < limits[resource];
  }
}
