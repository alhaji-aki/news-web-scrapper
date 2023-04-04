import { MaxLength, IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateOutletCategoryDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  link: string;
}
