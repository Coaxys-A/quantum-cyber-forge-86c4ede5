import { IsString, IsEnum, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StageStatus } from '@prisma/client';

export class CreateStageDto {
  @ApiProperty()
  @IsInt()
  index: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

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
