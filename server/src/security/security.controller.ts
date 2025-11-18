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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SecurityService } from './security.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { CreateFindingDto } from './dto/create-finding.dto';

@ApiTags('security')
@Controller('security')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get security dashboard' })
  getDashboard() {
    return this.securityService.getDashboard();
  }

  // Risks
  @Post('risks')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Create a new risk' })
  createRisk(@Body() createRiskDto: CreateRiskDto, @Request() req) {
    return this.securityService.createRisk(createRiskDto, req.user.userId);
  }

  @Get('risks')
  @ApiOperation({ summary: 'Get all risks' })
  findAllRisks(@Query('status') status?: string, @Query('severity') severity?: string) {
    return this.securityService.findAllRisks({ status, severity });
  }

  @Get('risks/:id')
  @ApiOperation({ summary: 'Get risk by ID' })
  findOneRisk(@Param('id') id: string) {
    return this.securityService.findOneRisk(id);
  }

  @Get('risks/:id/score')
  @ApiOperation({ summary: 'Get calculated risk score' })
  getRiskScore(@Param('id') id: string) {
    return this.securityService.getRiskScore(id);
  }

  @Patch('risks/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update risk' })
  updateRisk(@Param('id') id: string, @Body() updateRiskDto: UpdateRiskDto) {
    return this.securityService.updateRisk(id, updateRiskDto);
  }

  @Delete('risks/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete risk' })
  removeRisk(@Param('id') id: string) {
    return this.securityService.removeRisk(id);
  }

  // Controls
  @Post('controls')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Create a new control' })
  createControl(@Body() createControlDto: CreateControlDto) {
    return this.securityService.createControl(createControlDto);
  }

  @Get('controls')
  @ApiOperation({ summary: 'Get all controls' })
  findAllControls(
    @Query('framework') framework?: string,
    @Query('status') status?: string,
  ) {
    return this.securityService.findAllControls({ framework, status });
  }

  @Get('controls/:id')
  @ApiOperation({ summary: 'Get control by ID' })
  findOneControl(@Param('id') id: string) {
    return this.securityService.findOneControl(id);
  }

  @Patch('controls/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update control' })
  updateControl(@Param('id') id: string, @Body() updateControlDto: UpdateControlDto) {
    return this.securityService.updateControl(id, updateControlDto);
  }

  @Delete('controls/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete control' })
  removeControl(@Param('id') id: string) {
    return this.securityService.removeControl(id);
  }

  // Findings
  @Post('findings')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Create a new finding' })
  createFinding(@Body() createFindingDto: CreateFindingDto) {
    return this.securityService.createFinding(createFindingDto);
  }

  @Patch('findings/:id/resolve')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Resolve a finding' })
  resolveFinding(@Param('id') id: string) {
    return this.securityService.resolveFinding(id);
  }
}
