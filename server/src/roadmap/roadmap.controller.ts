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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoadmapService } from './roadmap.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@ApiTags('roadmap')
@Controller('roadmap')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoadmapController {
  constructor(private roadmapService: RoadmapService) {}

  // Stages
  @Post('stages')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new stage' })
  createStage(@Body() createStageDto: CreateStageDto) {
    return this.roadmapService.createStage(createStageDto);
  }

  @Get('stages')
  @ApiOperation({ summary: 'Get all stages with progress' })
  findAllStages() {
    return this.roadmapService.findAllStages();
  }

  @Get('stages/:id')
  @ApiOperation({ summary: 'Get stage by ID' })
  findOneStage(@Param('id') id: string) {
    return this.roadmapService.findOneStage(id);
  }

  @Patch('stages/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update stage' })
  updateStage(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return this.roadmapService.updateStage(id, updateStageDto);
  }

  @Delete('stages/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete stage' })
  removeStage(@Param('id') id: string) {
    return this.roadmapService.removeStage(id);
  }

  // Tasks
  @Post('tasks')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Create a new task' })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.roadmapService.createTask(createTaskDto);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks with filters' })
  findAllTasks(
    @Query('stageId') stageId?: string,
    @Query('status') status?: string,
  ) {
    return this.roadmapService.findAllTasks({ stageId, status });
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOneTask(@Param('id') id: string) {
    return this.roadmapService.findOneTask(id);
  }

  @Patch('tasks/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Update task' })
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.roadmapService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @Roles('ADMIN', 'OPS')
  @ApiOperation({ summary: 'Delete task' })
  removeTask(@Param('id') id: string) {
    return this.roadmapService.removeTask(id);
  }

  // Milestones
  @Post('milestones')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new milestone' })
  createMilestone(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.roadmapService.createMilestone(createMilestoneDto);
  }

  @Get('milestones')
  @ApiOperation({ summary: 'Get all milestones' })
  findAllMilestones() {
    return this.roadmapService.findAllMilestones();
  }

  // Stats
  @Get('stats')
  @ApiOperation({ summary: 'Get roadmap statistics' })
  getStats() {
    return this.roadmapService.getRoadmapStats();
  }
}
