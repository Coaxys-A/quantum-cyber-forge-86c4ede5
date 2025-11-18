import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModulesModule } from './modules/modules.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { ArchitectureModule } from './architecture/architecture.module';
import { SecurityModule } from './security/security.module';
import { SimulationModule } from './simulation/simulation.module';
import { PaymentsModule } from './payments/payments.module';
import { DocsModule } from './docs/docs.module';
import { HealthController } from './health/health.controller';

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
    ModulesModule,
    RoadmapModule,
    ArchitectureModule,
    SecurityModule,
    SimulationModule,
    PaymentsModule,
    DocsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
