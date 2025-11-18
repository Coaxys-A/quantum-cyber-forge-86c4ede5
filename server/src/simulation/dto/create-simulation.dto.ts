import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SimulationScenario } from '@prisma/client';

export class CreateSimulationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: SimulationScenario })
  @IsEnum(SimulationScenario)
  scenarioType: SimulationScenario;
}
