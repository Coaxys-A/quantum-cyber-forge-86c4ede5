import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScanRequestDto {
  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  path?: string;
}
