import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../common/decorators/tenant.decorator';
import { FindingsService } from './findings.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { UpdateFindingDto } from './dto/update-finding.dto';

@ApiTags('findings')
@Controller('findings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FindingsController {
  constructor(private findingsService: FindingsService) {}

  @Post()
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Create finding (Admin/Ops only)' })
  create(
    @Body() createFindingDto: CreateFindingDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.findingsService.create(tenantId, createFindingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all findings' })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @TenantId() tenantId: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
  ) {
    return this.findingsService.findAll(tenantId, { severity, status });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get findings statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.findingsService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get finding by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.findingsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update finding (Admin/Ops only)' })
  update(
    @Param('id') id: string,
    @Body() updateFindingDto: UpdateFindingDto,
    @TenantId() tenantId: string,
  ) {
    return this.findingsService.update(id, tenantId, updateFindingDto);
  }

  @Patch(':id/resolve')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Resolve finding (Admin/Ops only)' })
  resolve(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.findingsService.resolve(id, tenantId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete finding (Admin only)' })
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.findingsService.remove(id, tenantId);
  }
}
