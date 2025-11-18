import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HealthStatus } from '@prisma/client';

export class UpdateComponentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiProperty({ enum: HealthStatus, required: false })
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;
}
