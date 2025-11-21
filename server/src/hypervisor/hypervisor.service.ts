import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HypervisorService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAllTenants(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              modules: true,
              risks: true,
              simulations: true,
            },
          },
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllUsers(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          tenantId: true,
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getGlobalStats() {
    const [
      totalTenants,
      totalUsers,
      totalModules,
      totalRisks,
      totalSimulations,
      activeTenants,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.user.count(),
      this.prisma.module.count(),
      this.prisma.riskItem.count(),
      this.prisma.simulation.count(),
      this.prisma.tenant.count({
        where: {
          subscription: {
            isNot: null,
            status: 'active',
          },
        },
      }),
    ]);

    return {
      totalTenants,
      totalUsers,
      totalModules,
      totalRisks,
      totalSimulations,
      activeTenants,
    };
  }

  async impersonateUser(userId: string, hypervisorId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Log impersonation
    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: hypervisorId,
        action: 'IMPERSONATE',
        resourceType: 'USER',
        resourceId: userId,
        details: {
          impersonatedUserId: userId,
          impersonatedUserEmail: user.email,
        },
      },
    });

    // Generate impersonation token
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      impersonatedBy: hypervisorId,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h', // Shorter expiry for impersonation
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async overrideTenantPlan(tenantId: string, planId: string) {
    const [tenant, plan] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.prisma.plan.findUnique({ where: { id: planId } }),
    ]);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Create or update subscription
    const subscription = await this.prisma.subscription.upsert({
      where: {
        tenantId,
      },
      update: {
        planId,
        status: 'active',
      },
      create: {
        tenantId,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      include: {
        plan: true,
      },
    });

    return subscription;
  }

  async getGlobalAuditLogs(page = 1, limit = 50, tenantId?: string) {
    const skip = (page - 1) * limit;
    const where = tenantId ? { tenantId } : {};

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSystemHealth() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Get recent error logs
      const recentErrors = await this.prisma.auditLog.count({
        where: {
          action: 'ERROR',
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
          },
        },
      });

      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        metrics: {
          recentErrors,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
