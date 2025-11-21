import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai-request.dto';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('security-analyst')
  @ApiOperation({ summary: 'AI Security Analyst' })
  securityAnalyst(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.securityAnalyst(tenantId, aiRequestDto);
  }

  @Post('architecture-analyzer')
  @ApiOperation({ summary: 'AI Architecture Analyzer' })
  architectureAnalyzer(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.architectureAnalyzer(tenantId, aiRequestDto);
  }

  @Post('apt-simulator')
  @ApiOperation({ summary: 'AI APT Simulator' })
  aptSimulator(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.aptSimulator(tenantId, aiRequestDto);
  }

  @Post('compliance-assistant')
  @ApiOperation({ summary: 'AI Compliance Assistant' })
  complianceAssistant(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.complianceAssistant(tenantId, aiRequestDto);
  }

  @Post('devsecops-advisor')
  @ApiOperation({ summary: 'AI DevSecOps Advisor' })
  devsecopsAdvisor(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.devsecopsAdvisor(tenantId, aiRequestDto);
  }

  @Post('chat')
  @ApiOperation({ summary: 'AI Universal Assistant' })
  chat(
    @Body() aiRequestDto: AiRequestDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.aiService.universalAssistant(tenantId, req.user.userId, aiRequestDto);
  }
}
