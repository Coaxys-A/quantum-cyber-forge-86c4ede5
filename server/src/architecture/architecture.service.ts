import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { CreateEdgeDto } from './dto/create-edge.dto';

@Injectable()
export class ArchitectureService {
  constructor(private prisma: PrismaService) {}

  async createComponent(tenantId: string, createComponentDto: CreateComponentDto) {
    return this.prisma.componentNode.create({
      data: {
        ...createComponentDto,
        tenantId,
      },
    });
  }

  async findAllComponents(tenantId: string) {
    return this.prisma.componentNode.findMany({
      where: { tenantId },
      include: {
        edgesFrom: {
          include: {
            toComponent: true,
          },
        },
        edgesTo: {
          include: {
            fromComponent: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOneComponent(id: string, tenantId: string) {
    const component = await this.prisma.componentNode.findUnique({
      where: { id },
      include: {
        edgesFrom: {
          include: {
            toComponent: true,
          },
        },
        edgesTo: {
          include: {
            fromComponent: true,
          },
        },
      },
    });

    if (!component || component.tenantId !== tenantId) {
      throw new NotFoundException('Component not found');
    }

    return component;
  }

  async updateComponent(id: string, tenantId: string, updateComponentDto: UpdateComponentDto) {
    await this.findOneComponent(id, tenantId);

    return this.prisma.componentNode.update({
      where: { id },
      data: updateComponentDto,
    });
  }

  async removeComponent(id: string, tenantId: string) {
    await this.findOneComponent(id, tenantId);

    return this.prisma.componentNode.delete({
      where: { id },
    });
  }

  async createEdge(tenantId: string, createEdgeDto: CreateEdgeDto) {
    return this.prisma.componentEdge.create({
      data: {
        ...createEdgeDto,
        tenantId,
      },
      include: {
        fromComponent: true,
        toComponent: true,
      },
    });
  }

  async findAllEdges(tenantId: string) {
    return this.prisma.componentEdge.findMany({
      where: { tenantId },
      include: {
        fromComponent: true,
        toComponent: true,
      },
    });
  }

  async removeEdge(id: string, tenantId: string) {
    const edge = await this.prisma.componentEdge.findUnique({
      where: { id },
    });

    if (!edge || edge.tenantId !== tenantId) {
      throw new NotFoundException('Edge not found');
    }

    return this.prisma.componentEdge.delete({
      where: { id },
    });
  }

  async getArchitectureGraph(tenantId: string) {
    const [components, edges] = await Promise.all([
      this.prisma.componentNode.findMany({
        where: { tenantId },
      }),
      this.prisma.componentEdge.findMany({
        where: { tenantId },
        include: {
          fromComponent: true,
          toComponent: true,
        },
      }),
    ]);

    return {
      components,
      edges,
    };
  }

  async getHealthSummary(tenantId: string) {
    const components = await this.prisma.componentNode.findMany({
      where: { tenantId },
    });

    const summary = components.reduce(
      (acc: Record<string, number>, component) => {
        acc[component.healthStatus] = (acc[component.healthStatus] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: components.length,
      byHealth: summary,
      averageRisk:
        components.reduce((sum: number, c) => sum + c.riskScore, 0) / components.length || 0,
    };
  }
}
