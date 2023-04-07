import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CustomBody } from '../common/decorators/custom-body.decorator';
import { customDecoratorsValidationOptions } from '../config/validation.config';

// TODO: hide all these endpoints except index behind an authentication
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async index() {
    return {
      message: 'Get categories',
      data: await this.categoryService.index(),
    };
  }

  @Post()
  async create(
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    createCategoryDto: CreateCategoryDto,
  ) {
    return {
      message: 'Category created succcessfully.',
      data: await this.categoryService.create(createCategoryDto),
    };
  }

  @Get(':category')
  async show(@Param('category') category: string) {
    return {
      message: 'Get category',
      data: await this.categoryService.show(category),
    };
  }

  @Patch(':category')
  async update(
    @Param('category') category: string,
    @CustomBody(
      'category',
      new ValidationPipe(customDecoratorsValidationOptions),
    )
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return {
      message: 'Category updated succcessfully.',
      data: await this.categoryService.update(category, updateCategoryDto),
    };
  }

  @Delete(':category')
  async destroy(@Param('category') category: string) {
    return {
      message: 'Category deleted successfully.',
      data: await this.categoryService.delete(category),
    };
  }
}
