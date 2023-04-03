import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { MaxLength, IsOptional } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['name'] as const),
) {
  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Category,
    ignoreValue: (o: UpdateCategoryDto) => o.entity,
    ignoreColumn: 'slug',
  })
  name: string;
}
