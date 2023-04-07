import { MaxLength, IsUrl, IsNotEmpty, ValidateNested } from 'class-validator';
import { Selectors } from './selectors.dto';

export class UpdateOutletCategoryDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  link: string;

  @ValidateNested()
  selectors: Selectors;
}
