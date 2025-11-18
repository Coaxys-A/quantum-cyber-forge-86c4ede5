import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StageStatus } from '@prisma/client';

export class CreateMilestoneDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  targetDate: string;

  @ApiProperty({ enum: StageStatus, required: false })
  @IsOptional()
  @IsEnum(StageStatus)
  status?: StageStatus;
}
