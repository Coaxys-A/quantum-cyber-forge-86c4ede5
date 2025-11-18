import { IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskSeverity } from '@prisma/client';

export class CreateRiskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: RiskSeverity })
  @IsEnum(RiskSeverity)
  severity: RiskSeverity;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  likelihood: number;
}
