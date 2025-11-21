import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}
