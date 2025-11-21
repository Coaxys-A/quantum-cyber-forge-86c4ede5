import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['HYPERVISOR', 'PLATFORM_ADMIN', 'ADMIN', 'OPS', 'VIEWER', 'BILLING_OWNER'], required: false })
  @IsOptional()
  @IsEnum(['HYPERVISOR', 'PLATFORM_ADMIN', 'ADMIN', 'OPS', 'VIEWER', 'BILLING_OWNER'])
  role?: 'HYPERVISOR' | 'PLATFORM_ADMIN' | 'ADMIN' | 'OPS' | 'VIEWER' | 'BILLING_OWNER';
}
