import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ControlStatus } from '@prisma/client';

export class UpdateControlDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ControlStatus, required: false })
  @IsOptional()
  @IsEnum(ControlStatus)
  status?: ControlStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  evidenceLinks?: string;
}
