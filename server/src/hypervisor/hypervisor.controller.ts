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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipTenantCheck } from '../common/decorators/tenant.decorator';
import { HypervisorService } from './hypervisor.service';

@ApiTags('hypervisor')
@Controller('hypervisor')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('ADMIN') // Only platform admins
@SkipTenantCheck()
export class HypervisorController {
  constructor(private hypervisorService: HypervisorService) {}

  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants (Hypervisor only)' })
  getAllTenants(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.hypervisorService.getAllTenants(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Hypervisor only)' })
  getAllUsers(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.hypervisorService.getAllUsers(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get global stats (Hypervisor only)' })
  getGlobalStats() {
    return this.hypervisorService.getGlobalStats();
  }

  @Post('impersonate/:userId')
  @ApiOperation({ summary: 'Impersonate user (Hypervisor only)' })
  impersonateUser(@Param('userId') userId: string, @Request() req) {
    return this.hypervisorService.impersonateUser(userId, req.user.userId);
  }

  @Patch('tenants/:tenantId/plan')
  @ApiOperation({ summary: 'Override tenant plan (Hypervisor only)' })
  overridePlan(
    @Param('tenantId') tenantId: string,
    @Body() body: { planId: string },
  ) {
    return this.hypervisorService.overrideTenantPlan(tenantId, body.planId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get global audit logs (Hypervisor only)' })
  getGlobalAuditLogs(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('tenantId') tenantId?: string,
  ) {
    return this.hypervisorService.getGlobalAuditLogs(
      parseInt(page, 10),
      parseInt(limit, 10),
      tenantId,
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'System health check (Hypervisor only)' })
  getSystemHealth() {
    return this.hypervisorService.getSystemHealth();
  }
}
