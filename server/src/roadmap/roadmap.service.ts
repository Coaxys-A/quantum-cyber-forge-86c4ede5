import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@Injectable()
export class RoadmapService {
  constructor(private prisma: PrismaService) {}

  // Stages
  async createStage(tenantId: string, createStageDto: CreateStageDto) {
    return this.prisma.stage.create({
      data: {
        ...createStageDto,
        tenantId,
      },
      include: {
        tasks: true,
      },
    });
  }

  async findAllStages(tenantId: string) {
    const stages = await this.prisma.stage.findMany({
      where: { tenantId },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        index: 'asc',
      },
    });

    // Calculate progress for each stage
    return stages.map((stage) => {
      const totalTasks = stage.tasks.length;
      const completedTasks = stage.tasks.filter((t) => t.status === 'DONE').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...stage,
        progress,
      };
    });
  }

  async findOneStage(id: string) {
    const stage = await this.prisma.stage.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return stage;
  }

  async updateStage(id: string, updateStageDto: UpdateStageDto) {
    await this.findOneStage(id);

    return this.prisma.stage.update({
      where: { id },
      data: updateStageDto,
      include: {
        tasks: true,
      },
    });
  }

  async removeStage(id: string) {
    await this.findOneStage(id);

    return this.prisma.stage.delete({
      where: { id },
    });
  }

  // Tasks
  async createTask(tenantId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        tenantId,
      },
      include: {
        stage: true,
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllTasks(tenantId: string, filters?: { stageId?: string; status?: string }) {
    const where: any = { tenantId };

    if (filters?.stageId) {
      where.stageId = filters.stageId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        stage: true,
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        stage: true,
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOneTask(id);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        stage: true,
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async removeTask(id: string) {
    await this.findOneTask(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  // Milestones
  async createMilestone(tenantId: string, createMilestoneDto: CreateMilestoneDto) {
    return this.prisma.milestone.create({
      data: {
        ...createMilestoneDto,
        tenantId,
      },
    });
  }

  async findAllMilestones(tenantId: string) {
    return this.prisma.milestone.findMany({
      where: { tenantId },
      orderBy: {
        targetDate: 'asc',
      },
    });
  }

  async getRoadmapStats(tenantId: string) {
    const [totalStages, totalTasks, tasksByStatus] = await Promise.all([
      this.prisma.stage.count({ where: { tenantId } }),
      this.prisma.task.count({ where: { tenantId } }),
      this.prisma.task.groupBy({
        where: { tenantId },
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      totalStages,
      totalTasks,
      tasksByStatus,
    };
  }
}
