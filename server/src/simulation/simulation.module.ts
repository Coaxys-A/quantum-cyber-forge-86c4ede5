import { Module } from '@nestjs/common';
import { SimulationGateway } from './simulation.gateway';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService, SimulationGateway],
})
export class SimulationModule {}
