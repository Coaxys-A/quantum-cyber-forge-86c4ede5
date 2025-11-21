import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../common/decorators/tenant.decorator';
import { AuditLogsService } from './audit-logs.service';

@ApiTags('audit-logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private auditLogsService: AuditLogsService) {}

  @Get()
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Get audit logs (Admin/Ops only)' })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @TenantId() tenantId: string,
    @Query('action') action?: string,
    @Query('resourceType') resourceType?: string,
    @Query('userId') userId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.auditLogsService.findAll(tenantId, {
      action,
      resourceType,
      userId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get('stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get audit log statistics (Admin only)' })
  getStats(@TenantId() tenantId: string) {
    return this.auditLogsService.getStats(tenantId);
  }
}
