import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: ['ADMIN', 'OPS', 'VIEWER'] })
  @IsEnum(['ADMIN', 'OPS', 'VIEWER'])
  role: 'ADMIN' | 'OPS' | 'VIEWER';
}
