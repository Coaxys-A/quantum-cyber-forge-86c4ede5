import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  async create(createSimulationDto: CreateSimulationDto) {
    return this.prisma.simulation.create({
      data: {
        ...createSimulationDto,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.simulation.findMany({
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.simulation.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 100,
        },
      },
    });
  }

  async start(id: string) {
    const simulation = await this.prisma.simulation.update({
      where: { id },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });

    // Seed initial mock events
    await this.seedMockEvents(id);

    return simulation;
  }

  async stop(id: string) {
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

  async getEvents(simulationId: string) {
    return this.prisma.simulationEvent.findMany({
      where: { simulationId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
