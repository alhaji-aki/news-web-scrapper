import {
  IsNotEmpty,
  MaxLength,
  IsUrl,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Outlet } from '../entities/outlet.entity';
import { BaseDto } from '../../common/dto/base.dto';
import { Type } from 'class-transformer';
import { AddCategoryToOutletDto } from './add-category-to-outlet.dto';

export class CreateOutletDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({
    entity: Outlet,
  })
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({
    entity: Outlet,
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  website: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddCategoryToOutletDto)
  categories: AddCategoryToOutletDto[];
}
