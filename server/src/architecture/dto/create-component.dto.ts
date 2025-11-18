import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentType, HealthStatus } from '@prisma/client';

export class CreateComponentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ComponentType })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiProperty({ enum: HealthStatus, required: false })
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;
}
