import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { CreateFindingDto } from './dto/create-finding.dto';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  // Risk Items
  async createRisk(createRiskDto: CreateRiskDto, userId: string) {
    return this.prisma.riskItem.create({
      data: {
        ...createRiskDto,
        ownerUserId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        findings: true,
      },
    });
  }

  async findAllRisks(filters?: { status?: string; severity?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.severity) {
      where.severity = filters.severity;
    }

    return this.prisma.riskItem.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        findings: true,
      },
      orderBy: [
        { severity: 'desc' },
        { likelihood: 'desc' },
      ],
    });
  }

  async findOneRisk(id: string) {
    const risk = await this.prisma.riskItem.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        findings: true,
      },
    });

    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    return risk;
  }

  async updateRisk(id: string, updateRiskDto: UpdateRiskDto) {
    await this.findOneRisk(id);

    return this.prisma.riskItem.update({
      where: { id },
      data: updateRiskDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        findings: true,
      },
    });
  }

  async removeRisk(id: string) {
    await this.findOneRisk(id);

    return this.prisma.riskItem.delete({
      where: { id },
    });
  }

  async getRiskScore(id: string) {
    const risk = await this.findOneRisk(id);
    
    const severityMap = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4,
    };

    const score = severityMap[risk.severity] * risk.likelihood;

    return {
      riskId: risk.id,
      severity: risk.severity,
      likelihood: risk.likelihood,
      score,
      rating: score >= 12 ? 'CRITICAL' : score >= 8 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW',
    };
  }

  // Controls
  async createControl(createControlDto: CreateControlDto) {
    return this.prisma.control.create({
      data: createControlDto,
    });
  }

  async findAllControls(filters?: { framework?: string; status?: string }) {
    const where: any = {};

    if (filters?.framework) {
      where.framework = filters.framework;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.control.findMany({
      where,
      orderBy: {
        framework: 'asc',
      },
    });
  }

  async findOneControl(id: string) {
    const control = await this.prisma.control.findUnique({
      where: { id },
    });

    if (!control) {
      throw new NotFoundException('Control not found');
    }

    return control;
  }

  async updateControl(id: string, updateControlDto: UpdateControlDto) {
    await this.findOneControl(id);

    return this.prisma.control.update({
      where: { id },
      data: updateControlDto,
    });
  }

  async removeControl(id: string) {
    await this.findOneControl(id);

    return this.prisma.control.delete({
      where: { id },
    });
  }

  // Findings
  async createFinding(createFindingDto: CreateFindingDto) {
    return this.prisma.finding.create({
      data: createFindingDto,
      include: {
        riskItem: true,
      },
    });
  }

  async resolveFinding(id: string) {
    return this.prisma.finding.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
      },
    });
  }

  // Dashboard
  async getDashboard() {
    const [totalRisks, risksBySeverity, risksByStatus, totalControls, controlsByStatus] =
      await Promise.all([
        this.prisma.riskItem.count(),
        this.prisma.riskItem.groupBy({
          by: ['severity'],
          _count: true,
        }),
        this.prisma.riskItem.groupBy({
          by: ['status'],
          _count: true,
        }),
        this.prisma.control.count(),
        this.prisma.control.groupBy({
          by: ['status'],
          _count: true,
        }),
      ]);

    const topRisks = await this.prisma.riskItem.findMany({
      where: {
        status: { in: ['OPEN', 'IN_REVIEW'] },
      },
      orderBy: [
        { severity: 'desc' },
        { likelihood: 'desc' },
      ],
      take: 5,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      totalRisks,
      risksBySeverity,
      risksByStatus,
      totalControls,
      controlsByStatus,
      topRisks,
    };
  }
}
