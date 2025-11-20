import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DocsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    return this.prisma.docPage.findMany({
      where: category ? { category } : undefined,
      orderBy: { category: 'asc' },
    });
  }

  async findBySlug(slug: string, language: string = 'en') {
    return this.prisma.docPage.findUnique({
      where: {
        slug_language: { slug, language },
      },
    });
  }

  async search(query: string) {
    return this.prisma.docPage.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { contentMarkdown: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}
