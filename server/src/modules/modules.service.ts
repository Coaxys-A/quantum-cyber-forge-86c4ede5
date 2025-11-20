import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleStatus, ModuleCategory } from '@prisma/client';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createModuleDto: CreateModuleDto, userId: string) {
    // Ensure slug is unique for this tenant
    const existing = await this.prisma.module.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createModuleDto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Module with this slug already exists');
    }

    return this.prisma.module.create({
      data: {
        ...createModuleDto,
        tenantId,
        ownerUserId: userId,
        status: createModuleDto.status || ModuleStatus.DRAFT,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        interfaces: true,
        dependencies: true,
        activities: true,
      },
    });
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: ModuleStatus;
      category?: ModuleCategory;
      search?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.module.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        interfaces: {
          select: {
            id: true,
            type: true,
          },
        },
        _count: {
          select: {
            dependencies: true,
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        interfaces: true,
        dependencies: {
          include: {
            dependsOnModule: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        activities: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async findBySlug(tenantId: string, slug: string) {
    const module = await this.prisma.module.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        interfaces: true,
        dependencies: {
          include: {
            dependsOnModule: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        activities: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.module.update({
      where: { id },
      data: updateModuleDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        interfaces: true,
        dependencies: true,
        activities: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.module.delete({
      where: { id },
    });
  }

  async getStats(tenantId: string) {
    const [total, byStatus, byCategory] = await Promise.all([
      this.prisma.module.count({ where: { tenantId } }),
      this.prisma.module.groupBy({
        where: { tenantId },
        by: ['status'],
        _count: true,
      }),
      this.prisma.module.groupBy({
        where: { tenantId },
        by: ['category'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus,
      byCategory,
    };
  }
}
