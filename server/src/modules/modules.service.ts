import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleStatus, ModuleCategory } from '@prisma/client';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto, userId: string) {
    const { name, slug, category, version, status, description } = createModuleDto;

    // Check if slug already exists
    const existing = await this.prisma.module.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Module with this slug already exists');
    }

    return this.prisma.module.create({
      data: {
        name,
        slug,
        category,
        version,
        status: status || ModuleStatus.IN_DEV,
        description,
        ownerUserId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        interfaces: true,
        endpoints: true,
      },
    });
  }

  async findAll(filters?: {
    status?: ModuleStatus;
    category?: ModuleCategory;
    search?: string;
  }) {
    const where: any = {};

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
            role: true,
          },
        },
        _count: {
          select: {
            interfaces: true,
            endpoints: true,
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
            role: true,
          },
        },
        interfaces: true,
        endpoints: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async findBySlug(slug: string) {
    const module = await this.prisma.module.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        interfaces: true,
        endpoints: true,
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
            role: true,
          },
        },
        interfaces: true,
        endpoints: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.module.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, byStatus, byCategory] = await Promise.all([
      this.prisma.module.count(),
      this.prisma.module.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.module.groupBy({
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
