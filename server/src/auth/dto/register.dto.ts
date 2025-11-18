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

  @ApiProperty({ enum: ['ADMIN', 'OPS', 'VIEWER'], required: false })
  @IsOptional()
  @IsEnum(['ADMIN', 'OPS', 'VIEWER'])
  role?: 'ADMIN' | 'OPS' | 'VIEWER';
}
