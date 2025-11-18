import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskSeverity, RiskStatus } from '@prisma/client';

export class UpdateRiskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RiskSeverity, required: false })
  @IsOptional()
  @IsEnum(RiskSeverity)
  severity?: RiskSeverity;

  @ApiProperty({ minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  likelihood?: number;

  @ApiProperty({ enum: RiskStatus, required: false })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;
}
