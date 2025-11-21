import { Module } from '@nestjs/common';
import { HypervisorController } from './hypervisor.controller';
import { HypervisorService } from './hypervisor.service';

@Module({
  controllers: [HypervisorController],
  providers: [HypervisorService],
})
export class HypervisorModule {}
