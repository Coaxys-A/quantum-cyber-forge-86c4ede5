import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const PLAN_LIMIT_KEY = 'planLimit';

export interface PlanLimitMetadata {
  resource: string;
  limit: number;
}

export const PlanLimit = (resource: string, limit: number) => 
  Reflect.metadata(PLAN_LIMIT_KEY, { resource, limit });

@Injectable()
export class PlanLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const planLimit = this.reflector.getAllAndOverride<PlanLimitMetadata>(
      PLAN_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!planLimit) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    if (!tenantId) {
      return true; // Skip check if no tenant context
    }

    // Get tenant subscription
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new ForbiddenException('No active subscription');
    }

    const limits = subscription.plan.limits as any;
    const resourceLimit = limits?.[planLimit.resource];

    if (resourceLimit === undefined || resourceLimit === null) {
      return true; // No limit defined
    }

    // Count current usage
    const count = await this.getResourceCount(tenantId, planLimit.resource);

    if (count >= resourceLimit) {
      throw new ForbiddenException(
        `Plan limit reached for ${planLimit.resource}. Upgrade your plan to continue.`,
      );
    }

    return true;
  }

  private async getResourceCount(tenantId: string, resource: string): Promise<number> {
    const resourceMap: Record<string, any> = {
      modules: () => this.prisma.module.count({ where: { tenantId } }),
      components: () => this.prisma.componentNode.count({ where: { tenantId } }),
      risks: () => this.prisma.riskItem.count({ where: { tenantId } }),
      simulations: () => this.prisma.simulation.count({ where: { tenantId } }),
      users: () => this.prisma.user.count({ where: { tenantId } }),
    };

    const countFn = resourceMap[resource];
    return countFn ? await countFn() : 0;
  }
}
