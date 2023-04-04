import { IsNotEmpty, MaxLength, IsUrl } from 'class-validator';
import { IsExists } from '../../common/validators/exists.validator';
import { Category } from '../../category/entities/category.entity';

export class AddCategoryToOutletDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsExists({ entity: Category, column: 'slug' })
  category: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  link: string;
}
