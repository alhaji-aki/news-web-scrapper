import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { FilterArticleDto } from '../dto/filter-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async index(@Query() filterArticleDto: FilterArticleDto) {
    return {
      message: 'Get articles',
      data: await this.articleService.index(filterArticleDto),
    };
  }

  @Get(':article')
  async show(@Param('article') article: string) {
    return {
      message: 'Get article',
      data: await this.articleService.show(article),
    };
  }

  // TODO: hide this behind an authentication layer
  @Delete(':article')
  async destroy(@Param('article') article: string) {
    return {
      message: 'Article deleted successfully.',
      data: await this.articleService.delete(article),
    };
  }
}
