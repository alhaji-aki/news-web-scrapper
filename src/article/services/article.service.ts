import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Like, Raw, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { FilterArticleDto } from '../dto/filter-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async index(filterArticleDto: FilterArticleDto) {
    const where = {};

    if (filterArticleDto.tag) {
      where['tags'] = { name: filterArticleDto.tag };
    }

    if (filterArticleDto.outlet) {
      where['outlet'] = { name: Like(`${filterArticleDto.outlet}%`) };
    }

    if (filterArticleDto.category) {
      where['category'] = { name: filterArticleDto.category };
    }

    if (filterArticleDto.publishedAt) {
      where['publishedAt'] = Raw((alias) => `DATE(${alias}) = :date`, {
        date: filterArticleDto.getFormatedPublishedAt(),
      });
    }

    return await this.articleRepository.find({
      where,
      relations: ['outlet', 'category', 'tags'],
    });
  }

  async create(createArticleDto: CreateArticleDto) {
    if (
      await this.articleRepository.findOneBy({ title: createArticleDto.title })
    ) {
      throw new BadRequestException(
        `Article with title '${createArticleDto.title}' already exists.`,
      );
    }

    const tags = await Promise.all(
      createArticleDto.tags.map((name) => this.preloadTagsByName(name)),
    );

    return await this.articleRepository.save(
      new Article({
        ...createArticleDto,
        tags,
      }),
    );
  }

  async show(article: string) {
    const articleEntity = await this.articleRepository.findOne({
      where: { slug: article },
      relations: ['outlet', 'category', 'tags'],
    });

    if (!articleEntity) {
      throw new NotFoundException('Article not found.');
    }

    return articleEntity;
  }

  async findArticleByLink(link: string) {
    return await this.articleRepository.findOneBy({
      url: link,
    });
  }

  async delete(article: string) {
    const articleEntity = await this.articleRepository.findOneBy({
      slug: article,
    });

    if (!articleEntity) {
      throw new NotFoundException('Article not found.');
    }

    return await this.articleRepository.remove(articleEntity);
  }

  private async preloadTagsByName(name: string): Promise<Tag> {
    const existingTag = await this.tagRepository.findOne({
      where: { name },
    });

    if (existingTag) {
      return existingTag;
    }

    return this.tagRepository.create({ name: name.toLowerCase() });
  }
}
