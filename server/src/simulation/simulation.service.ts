import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createSimulationDto: CreateSimulationDto, userId: string) {
    return this.prisma.simulation.create({
      data: {
        ...createSimulationDto,
        tenantId,
        createdByUserId: userId,
        status: 'DRAFT',
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.simulation.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 100,
        },
      },
    });

    if (!simulation || simulation.tenantId !== tenantId) {
      throw new Error('Simulation not found');
    }

    return simulation;
  }

  async start(id: string, tenantId: string) {
    const simulation = await this.prisma.simulation.update({
      where: { id },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });

    if (simulation.tenantId !== tenantId) {
      throw new Error('Unauthorized');
    }

    // Seed initial mock events
    await this.seedMockEvents(id);

    return simulation;
  }

  async stop(id: string, tenantId: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id },
    });

    if (!simulation || simulation.tenantId !== tenantId) {
      throw new Error('Simulation not found');
    }

    return this.prisma.simulation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
      },
    });
  }

  private async seedMockEvents(simulationId: string) {
    const mockEvents = [
      { actor: 'RED_AGENT', actionType: 'SCAN', description: 'Port scan initiated', severity: 'LOW' },
      { actor: 'BLUE_AGENT', actionType: 'DETECT', description: 'Anomaly detected', severity: 'MEDIUM' },
      { actor: 'RED_AGENT', actionType: 'EXPLOIT', description: 'Exploit attempted', severity: 'HIGH' },
    ];

    await this.prisma.simulationEvent.createMany({
      data: mockEvents.map((event) => ({
        ...event,
        simulationId,
        severity: event.severity as any,
      })),
    });
  }

  async getEvents(simulationId: string, tenantId: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id: simulationId },
    });

    if (!simulation || simulation.tenantId !== tenantId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.simulationEvent.findMany({
      where: { simulationId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
