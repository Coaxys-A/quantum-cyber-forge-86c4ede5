import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModuleCategory, ModuleStatus } from '@prisma/client';

export class UpdateModuleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ModuleCategory, required: false })
  @IsOptional()
  @IsEnum(ModuleCategory)
  category?: ModuleCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ enum: ModuleStatus, required: false })
  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
