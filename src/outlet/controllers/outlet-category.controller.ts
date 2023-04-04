import { Controller, Post, Patch, Param, Delete, Body } from '@nestjs/common';
import { OutletCategoryService } from '../services/outlet-category.service';
import { AddCategoryToOutletDto } from '../dto/add-category-to-outlet.dto';
import { UpdateOutletCategoryDto } from '../dto/update-outlet-category.dto';

@Controller('outlets/:outlet/categories')
export class OutletCategoryController {
  constructor(private readonly outletCategoryService: OutletCategoryService) {}

  @Post()
  async create(
    @Param('outlet') outlet: string,
    @Body() addCategoryDto: AddCategoryToOutletDto,
  ) {
    return {
      message: 'Category added to outlet succcessfully.',
      data: await this.outletCategoryService.create(outlet, addCategoryDto),
    };
  }

  @Patch(':category')
  async update(
    @Param('outlet') outlet: string,
    @Param('category') category: string,
    @Body() updateCategoryDto: UpdateOutletCategoryDto,
  ) {
    return {
      message: 'Outlet Category updated succcessfully.',
      data: await this.outletCategoryService.update(
        outlet,
        category,
        updateCategoryDto,
      ),
    };
  }

  @Delete(':category')
  async destroy(
    @Param('outlet') outlet: string,
    @Param('category') category: string,
  ) {
    return {
      message: 'Outlet category deleted successfully.',
      data: await this.outletCategoryService.delete(outlet, category),
    };
  }
}
