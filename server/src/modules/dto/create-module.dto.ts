import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModuleCategory, ModuleStatus } from '@prisma/client';

export class CreateModuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ enum: ModuleCategory })
  @IsEnum(ModuleCategory)
  category: ModuleCategory;

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty({ enum: ModuleStatus, required: false })
  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;

  @ApiProperty()
  @IsString()
  description: string;
}
