import { BadRequestException, Injectable } from '@nestjs/common';
import { AddCategoryToOutletDto } from '../dto/add-category-to-outlet.dto';
import { UpdateOutletCategoryDto } from '../dto/update-outlet-category.dto';
import { OutletService } from './outlet.service';
import { CategoryService } from '../../category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OutletCategory } from '../entities/outlet-category.entity';
import { IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { sub } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OutletCategoryService {
  constructor(
    private readonly outletService: OutletService,
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
    @InjectRepository(OutletCategory)
    private readonly outletCategoryRepository: Repository<OutletCategory>,
  ) {}

  async create(outlet: string, addCategoryToOutletDto: AddCategoryToOutletDto) {
    const outletEntity = await this.outletService.find(outlet);

    const categoryEntity = await this.categoryService.show(
      addCategoryToOutletDto.category,
    );

    // check if the outlet is not already assigned to this category
    if (await this.getOutletCategory(outletEntity.id, categoryEntity.id)) {
      throw new BadRequestException(
        'Outlet already has this category. Try updating it instead.',
      );
    }

    await this.checkLinkUniqueness(addCategoryToOutletDto.link);

    // create the outlet category
    return await this.outletCategoryRepository.save(
      new OutletCategory({
        ...addCategoryToOutletDto,
        outlet: outletEntity,
        category: categoryEntity,
      }),
    );
  }

  async update(
    outlet: string,
    category: string,
    updateOutletCategoryDto: UpdateOutletCategoryDto,
  ) {
    const outletEntity = await this.outletService.find(outlet);

    const categoryEntity = await this.categoryService.show(category);

    const outletCategoryEntity = await this.getOutletCategory(
      outletEntity.id,
      categoryEntity.id,
    );

    // check if the outlet is assigned to the category
    if (!outletCategoryEntity) {
      throw new BadRequestException(
        'Outlet does not have this category. Try adding it instead.',
      );
    }

    await this.checkLinkUniqueness(
      updateOutletCategoryDto.link,
      outletCategoryEntity.id,
    );

    // update the outlet category
    return await this.outletCategoryRepository.save(
      new OutletCategory({
        ...outletCategoryEntity,
        ...updateOutletCategoryDto,
      }),
    );
  }

  async delete(outlet: string, category: string) {
    const outletEntity = await this.outletService.find(outlet);

    const categoryEntity = await this.categoryService.show(category);

    const outletCategoryEntity = await this.getOutletCategory(
      outletEntity.id,
      categoryEntity.id,
    );

    // check if the outlet is assigned to the category
    if (!outletCategoryEntity) {
      throw new BadRequestException('Outlet does not have this category.');
    }

    // delete the outlet category
    return await this.outletCategoryRepository.remove(outletCategoryEntity);
  }

  async getOutletCategoriesForScraping() {
    return await this.outletCategoryRepository.find({
      where: [
        {
          currentlyScraping: false,
          lastScrapedAt: LessThanOrEqual(
            sub(Date.now(), {
              minutes: this.configService.get('app.scrape_minutes'),
            }),
          ),
        },
        {
          currentlyScraping: false,
          lastScrapedAt: IsNull(),
        },
      ],
      relations: ['outlet', 'category'],
    });
  }

  async markAsCurrentlyScraping(outletCategory: OutletCategory) {
    return await this.outletCategoryRepository.update(outletCategory.id, {
      currentlyScraping: true,
    });
  }

  async markAsScrapeCompleted(outletCategory: OutletCategory) {
    return await this.outletCategoryRepository.update(outletCategory.id, {
      currentlyScraping: false,
      lastScrapedAt: new Date(),
    });
  }

  private async getOutletCategory(outlet: number, category: number) {
    return await this.outletCategoryRepository.findOneBy({
      outletId: outlet,
      categoryId: category,
    });
  }

  private async checkLinkUniqueness(link: string, outletCategoryId?: number) {
    let where = { link };

    if (outletCategoryId) {
      where = {
        ...where,
        ...{ id: Not(outletCategoryId) },
      };
    }
    const outletCategory = await this.outletCategoryRepository.findOne({
      where,
      relations: ['outlet', 'category'],
    });

    if (outletCategory) {
      throw new BadRequestException(
        `The link '${link}' is already being used by outlet '${outletCategory.outlet.name}' for category '${outletCategory.category.name}'.`,
      );
    }
  }
}
