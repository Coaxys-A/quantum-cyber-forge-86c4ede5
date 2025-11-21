import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { DevSecOpsService } from './devsecops.service';
import { ScanRequestDto } from './dto/scan-request.dto';

@ApiTags('devsecops')
@Controller('devsecops')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DevSecOpsController {
  constructor(private devsecopsService: DevSecOpsService) {}

  @Post('scan/dependencies')
  @ApiOperation({ summary: 'Scan dependencies' })
  scanDependencies(
    @Body() scanRequestDto: ScanRequestDto,
    @TenantId() tenantId: string,
  ) {
    return this.devsecopsService.scanDependencies(tenantId, scanRequestDto);
  }

  @Post('scan/secrets')
  @ApiOperation({ summary: 'Scan for secrets' })
  scanSecrets(
    @Body() scanRequestDto: ScanRequestDto,
    @TenantId() tenantId: string,
  ) {
    return this.devsecopsService.scanSecrets(tenantId, scanRequestDto);
  }

  @Post('scan/sast')
  @ApiOperation({ summary: 'Run SAST scan' })
  runSAST(
    @Body() scanRequestDto: ScanRequestDto,
    @TenantId() tenantId: string,
  ) {
    return this.devsecopsService.runSAST(tenantId, scanRequestDto);
  }

  @Post('sbom/generate')
  @ApiOperation({ summary: 'Generate SBOM' })
  generateSBOM(
    @Body() scanRequestDto: ScanRequestDto,
    @TenantId() tenantId: string,
  ) {
    return this.devsecopsService.generateSBOM(tenantId, scanRequestDto);
  }

  @Get('pipeline/status')
  @ApiOperation({ summary: 'Get pipeline security status' })
  getPipelineStatus(@TenantId() tenantId: string) {
    return this.devsecopsService.getPipelineStatus(tenantId);
  }
}
