import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOutletDto } from '../dto/create-outlet.dto';
import { UpdateOutletDto } from '../dto/update-outlet.dto';
import { Outlet } from '../entities/outlet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddCategoryToOutletDto } from '../dto/add-category-to-outlet.dto';
import { OutletCategory } from '../entities/outlet-category.entity';
import { CategoryService } from '../../category/category.service';

@Injectable()
export class OutletService {
  constructor(
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    private readonly categoryService: CategoryService,
  ) {}

  async index() {
    return await this.outletsRepository.find();
  }

  async create(createOutletDto: CreateOutletDto) {
    const categories =
      createOutletDto.categories &&
      (await Promise.all(
        createOutletDto.categories.map(
          async (categoryToAdd: AddCategoryToOutletDto) => {
            return new OutletCategory({
              ...categoryToAdd,
              category: await this.categoryService.show(categoryToAdd.category),
            });
          },
        ),
      ));

    const outlet = this.outletsRepository.create({
      ...createOutletDto,
      categories,
    });

    return await this.outletsRepository.save(outlet);
  }

  async show(outlet: string) {
    const outletEntity = await this.outletsRepository.findOne({
      where: {
        uuid: outlet,
      },
      relations: ['categories', 'categories.category'],
    });

    if (!outletEntity) {
      throw new NotFoundException('Outlet not found.');
    }

    return outletEntity;
  }

  async find(outlet: string) {
    const outletEntity = await this.outletsRepository.findOneBy({
      uuid: outlet,
    });

    if (!outletEntity) {
      throw new NotFoundException('Outlet not found.');
    }

    return outletEntity;
  }

  async update(outlet: string, updateOutletDto: UpdateOutletDto) {
    const outletEntity = await this.outletsRepository.findOneBy({
      uuid: outlet,
    });

    if (!outletEntity) {
      throw new NotFoundException('Outlet not found.');
    }

    delete updateOutletDto['entity'];

    if (Object.keys(updateOutletDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return await this.outletsRepository.save(
      new Outlet({ ...outletEntity, ...updateOutletDto }),
    );
  }

  async delete(outlet: string) {
    const outletEntity = await this.outletsRepository.findOneBy({
      uuid: outlet,
    });

    if (!outletEntity) {
      throw new NotFoundException('Outlet not found.');
    }

    return await this.outletsRepository.remove(outletEntity);
  }
}
