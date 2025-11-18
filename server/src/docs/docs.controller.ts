import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocsService } from './docs.service';

@ApiTags('docs')
@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.docsService.findAll(category);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.docsService.search(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.docsService.findBySlug(slug);
  }
}
