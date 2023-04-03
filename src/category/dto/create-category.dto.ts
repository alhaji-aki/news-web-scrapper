import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Category } from '../entities/category.entity';
import { BaseDto } from '../../common/dto/base.dto';

export class CreateCategoryDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({
    entity: Category,
  })
  name: string;
}
