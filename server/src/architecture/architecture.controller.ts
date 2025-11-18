import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ArchitectureService } from './architecture.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { CreateEdgeDto } from './dto/create-edge.dto';

@ApiTags('architecture')
@Controller('architecture')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ArchitectureController {
  constructor(private architectureService: ArchitectureService) {}

  @Get('graph')
  @ApiOperation({ summary: 'Get complete architecture graph' })
  getGraph() {
    return this.architectureService.getArchitectureGraph();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get health summary' })
  getHealthSummary() {
    return this.architectureService.getHealthSummary();
  }

  @Post('components')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new component' })
  createComponent(@Body() createComponentDto: CreateComponentDto) {
    return this.architectureService.createComponent(createComponentDto);
  }

  @Get('components')
  @ApiOperation({ summary: 'Get all components' })
  findAllComponents() {
    return this.architectureService.findAllComponents();
  }

  @Get('components/:id')
  @ApiOperation({ summary: 'Get component by ID' })
  findOneComponent(@Param('id') id: string) {
    return this.architectureService.findOneComponent(id);
  }

  @Patch('components/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update component' })
  updateComponent(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    return this.architectureService.updateComponent(id, updateComponentDto);
  }

  @Delete('components/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete component' })
  removeComponent(@Param('id') id: string) {
    return this.architectureService.removeComponent(id);
  }

  @Post('edges')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new edge' })
  createEdge(@Body() createEdgeDto: CreateEdgeDto) {
    return this.architectureService.createEdge(createEdgeDto);
  }

  @Get('edges')
  @ApiOperation({ summary: 'Get all edges' })
  findAllEdges() {
    return this.architectureService.findAllEdges();
  }

  @Delete('edges/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete edge' })
  removeEdge(@Param('id') id: string) {
    return this.architectureService.removeEdge(id);
  }
}
