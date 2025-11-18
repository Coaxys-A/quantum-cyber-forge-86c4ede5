import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ControlStatus } from '@prisma/client';

export class CreateControlDto {
  @ApiProperty()
  @IsString()
  framework: string;

  @ApiProperty()
  @IsString()
  controlId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ControlStatus, required: false })
  @IsOptional()
  @IsEnum(ControlStatus)
  status?: ControlStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  evidenceLinks?: string;
}
