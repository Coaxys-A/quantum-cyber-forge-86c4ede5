import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@Controller('compliance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @Get('frameworks')
  @ApiOperation({ summary: 'Get compliance frameworks' })
  getFrameworks() {
    return this.complianceService.getFrameworks();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get compliance status' })
  getStatus(@TenantId() tenantId: string, @Query('framework') framework?: string) {
    return this.complianceService.getComplianceStatus(tenantId, framework);
  }

  @Get('gaps')
  @ApiOperation({ summary: 'Get compliance gaps' })
  getGaps(@TenantId() tenantId: string, @Query('framework') framework?: string) {
    return this.complianceService.getComplianceGaps(tenantId, framework);
  }

  @Post('generate-report')
  @ApiOperation({ summary: 'Generate compliance report' })
  generateReport(
    @TenantId() tenantId: string,
    @Body() body: { framework: string; format?: string },
  ) {
    return this.complianceService.generateReport(tenantId, body.framework, body.format);
  }
}
