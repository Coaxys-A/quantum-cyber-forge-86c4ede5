import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEdgeDto {
  @ApiProperty()
  @IsUUID()
  fromComponentId: string;

  @ApiProperty()
  @IsUUID()
  toComponentId: string;

  @ApiProperty()
  @IsString()
  linkType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
