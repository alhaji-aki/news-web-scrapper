import { Module } from '@nestjs/common';
import { OutletService } from './services/outlet.service';
import { OutletController } from './controllers/outlet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from './entities/outlet.entity';
import { OutletCategoryController } from './controllers/outlet-category.controller';
import { OutletCategoryService } from './services/outlet-category.service';
import { CategoryModule } from 'src/category/category.module';
import { OutletCategory } from './entities/outlet-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Outlet, OutletCategory]), CategoryModule],
  controllers: [OutletController, OutletCategoryController],
  providers: [OutletService, OutletCategoryService],
})
export class OutletModule {}
