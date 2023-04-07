import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ArticleService } from '../services/article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async index() {
    // TODO: add filter {tag, outlet, category, date} options
    return {
      message: 'Get articles',
      data: await this.articleService.index(),
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
