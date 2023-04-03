import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,
  ) {}

  async index() {
    return await this.categorysRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categorysRepository.create(createCategoryDto);

    return await this.categorysRepository.save(category);
  }

  async show(category: string) {
    const categoryEntity = await this.categorysRepository.findOneBy({
      slug: category,
    });

    if (!categoryEntity) {
      throw new NotFoundException('Category not found.');
    }

    return categoryEntity;
  }

  async update(category: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryEntity = await this.categorysRepository.findOneBy({
      slug: category,
    });

    if (!categoryEntity) {
      throw new NotFoundException('Category not found.');
    }

    delete updateCategoryDto['entity'];

    if (Object.keys(updateCategoryDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return await this.categorysRepository.save(
      new Category({ ...categoryEntity, ...updateCategoryDto }),
    );
  }

  async delete(category: string) {
    const categoryEntity = await this.categorysRepository.findOneBy({
      slug: category,
    });

    if (!categoryEntity) {
      throw new NotFoundException('Category not found.');
    }

    return await this.categorysRepository.remove(categoryEntity);
  }
}
