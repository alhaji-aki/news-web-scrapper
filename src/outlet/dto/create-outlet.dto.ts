import { IsNotEmpty, MaxLength, IsUrl } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Outlet } from '../entities/outlet.entity';
import { BaseDto } from '../../common/dto/base.dto';

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
}
