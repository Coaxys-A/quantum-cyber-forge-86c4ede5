import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleStatus, ModuleCategory } from '@prisma/client';

@ApiTags('modules')
@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new module (Admin only)' })
  create(@Body() createModuleDto: CreateModuleDto, @Request() req) {
    const tenantId = req.user.tenantId || req.tenantId;
    return this.modulesService.create(tenantId, createModuleDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ModuleStatus })
  @ApiQuery({ name: 'category', required: false, enum: ModuleCategory })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Request() req,
    @Query('status') status?: ModuleStatus,
    @Query('category') category?: ModuleCategory,
    @Query('search') search?: string,
  ) {
    const tenantId = req.user.tenantId || req.tenantId;
    return this.modulesService.findAll(tenantId, { status, category, search });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get module statistics' })
  getStats() {
    return this.modulesService.getStats();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get module by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.modulesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get module by ID' })
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update module (Admin/Ops only)' })
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete module (Admin only)' })
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
