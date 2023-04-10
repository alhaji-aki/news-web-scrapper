import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { FilterArticleDto } from '../dto/filter-article.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Delete(':article')
  async destroy(@Param('article') article: string) {
    return {
      message: 'Article deleted successfully.',
      data: await this.articleService.delete(article),
    };
  }
}
