import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Define tables in dependency order (reverse of creation)
    const tables = [
      'Comment',
      'Notification',
      'AuditLog',
      'AppSetting',
      'IntegrationConfig',
      'DocPage',
      'Invoice',
      'Subscription',
      'Plan',
      'SimulationEvent',
      'Simulation',
      'Finding',
      'ControlRisk',
      'Control',
      'RiskItem',
      'ComponentEdge',
      'ComponentNode',
      'Milestone',
      'Task',
      'Stage',
      'ModuleActivity',
      'ModuleDependency',
      'ModuleInterface',
      'Module',
      'RefreshToken',
      'User',
      'Tenant',
    ];

    for (const table of tables) {
      try {
        await (this.prisma as any)[table.charAt(0).toLowerCase() + table.slice(1)].deleteMany();
      } catch (error) {
        this.logger.warn(`Could not clean table ${table}: ${error}`);
      }
    }

    return { message: 'Database cleaned' };
  }
}
