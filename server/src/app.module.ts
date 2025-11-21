import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ModulesModule } from './modules/modules.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { ArchitectureModule } from './architecture/architecture.module';
import { SecurityModule } from './security/security.module';
import { SimulationModule } from './simulation/simulation.module';
import { PaymentsModule } from './payments/payments.module';
import { DocsModule } from './docs/docs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AiModule } from './ai/ai.module';
import { HealthController } from './health/health.controller';
import { TenantGuard } from './common/guards/tenant.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    SubscriptionsModule,
    ModulesModule,
    RoadmapModule,
    ArchitectureModule,
    SecurityModule,
    SimulationModule,
    PaymentsModule,
    DocsModule,
    NotificationsModule,
    AuditLogsModule,
    AiModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
