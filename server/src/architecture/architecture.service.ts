import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { CreateEdgeDto } from './dto/create-edge.dto';

@Injectable()
export class ArchitectureService {
  constructor(private prisma: PrismaService) {}

  async createComponent(createComponentDto: CreateComponentDto) {
    return this.prisma.component.create({
      data: createComponentDto,
    });
  }

  async findAllComponents() {
    return this.prisma.component.findMany({
      include: {
        outgoingEdges: {
          include: {
            toComponent: true,
          },
        },
        incomingEdges: {
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

  async findOneComponent(id: string) {
    const component = await this.prisma.component.findUnique({
      where: { id },
      include: {
        outgoingEdges: {
          include: {
            toComponent: true,
          },
        },
        incomingEdges: {
          include: {
            fromComponent: true,
          },
        },
      },
    });

    if (!component) {
      throw new NotFoundException('Component not found');
    }

    return component;
  }

  async updateComponent(id: string, updateComponentDto: UpdateComponentDto) {
    await this.findOneComponent(id);

    return this.prisma.component.update({
      where: { id },
      data: updateComponentDto,
    });
  }

  async removeComponent(id: string) {
    await this.findOneComponent(id);

    return this.prisma.component.delete({
      where: { id },
    });
  }

  async createEdge(createEdgeDto: CreateEdgeDto) {
    return this.prisma.componentEdge.create({
      data: createEdgeDto,
      include: {
        fromComponent: true,
        toComponent: true,
      },
    });
  }

  async findAllEdges() {
    return this.prisma.componentEdge.findMany({
      include: {
        fromComponent: true,
        toComponent: true,
      },
    });
  }

  async removeEdge(id: string) {
    return this.prisma.componentEdge.delete({
      where: { id },
    });
  }

  async getArchitectureGraph() {
    const [components, edges] = await Promise.all([
      this.prisma.component.findMany(),
      this.prisma.componentEdge.findMany({
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

  async getHealthSummary() {
    const components = await this.prisma.component.findMany();

    const summary = components.reduce(
      (acc, component) => {
        acc[component.healthStatus] = (acc[component.healthStatus] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: components.length,
      byHealth: summary,
      averageRisk:
        components.reduce((sum, c) => sum + c.riskScore, 0) / components.length || 0,
    };
  }
}
