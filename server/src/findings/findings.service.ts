import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { UpdateFindingDto } from './dto/update-finding.dto';

@Injectable()
export class FindingsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createFindingDto: CreateFindingDto) {
    return this.prisma.finding.create({
      data: {
        ...createFindingDto,
        tenantId,
      },
    });
  }

  async findAll(
    tenantId: string,
    filters: { severity?: string; status?: string },
  ) {
    const where: any = { tenantId };

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.finding.findMany({
      where,
      orderBy: { discoveredAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const finding = await this.prisma.finding.findUnique({
      where: { id },
    });

    if (!finding || finding.tenantId !== tenantId) {
      throw new NotFoundException('Finding not found');
    }

    return finding;
  }

  async update(id: string, tenantId: string, updateFindingDto: UpdateFindingDto) {
    await this.findOne(id, tenantId);

    return this.prisma.finding.update({
      where: { id },
      data: updateFindingDto,
    });
  }

  async resolve(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.finding.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.finding.delete({
      where: { id },
    });

    return { message: 'Finding deleted successfully' };
  }

  async getStats(tenantId: string) {
    const [total, bySeverity, byStatus, recent] = await Promise.all([
      this.prisma.finding.count({ where: { tenantId } }),
      this.prisma.finding.groupBy({
        by: ['severity'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.finding.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.finding.count({
        where: {
          tenantId,
          discoveredAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      recentWeek: recent,
      bySeverity: bySeverity.reduce(
        (acc, item) => {
          acc[item.severity] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status || 'unknown'] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
