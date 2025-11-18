import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StageStatus } from '@prisma/client';

export class UpdateStageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: StageStatus, required: false })
  @IsOptional()
  @IsEnum(StageStatus)
  status?: StageStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
