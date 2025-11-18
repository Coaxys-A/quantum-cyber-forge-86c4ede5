import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, updateRoleDto.role);
  }
}
