import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CategoryModule } from '../category/category.module';
import { OutletModule } from '../outlet/outlet.module';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';
import { ScrapperService } from './services/scrapper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Tag]),
    CategoryModule,
    OutletModule,
  ],
  controllers: [ArticleController, TagController],
  providers: [ArticleService, TagService, ScrapperService],
})
export class ArticleModule {}
