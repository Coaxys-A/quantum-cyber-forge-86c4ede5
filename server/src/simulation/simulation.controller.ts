import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@ApiTags('simulation')
@Controller('simulation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SimulationController {
  constructor(private simulationService: SimulationService) {}

  @Post()
  create(@Body() createSimulationDto: CreateSimulationDto) {
    return this.simulationService.create(createSimulationDto);
  }

  @Get()
  findAll() {
    return this.simulationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulationService.findOne(id);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.simulationService.start(id);
  }

  @Patch(':id/stop')
  stop(@Param('id') id: string) {
    return this.simulationService.stop(id);
  }

  @Get(':id/events')
  getEvents(@Param('id') id: string) {
    return this.simulationService.getEvents(id);
  }
}
