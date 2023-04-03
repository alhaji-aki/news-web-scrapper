import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOutletDto } from './create-outlet.dto';
import { MaxLength, IsUrl, IsOptional } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Outlet } from '../entities/outlet.entity';

export class UpdateOutletDto extends PartialType(
  OmitType(CreateOutletDto, ['name', 'website'] as const),
) {
  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Outlet,
    ignoreValue: (o: UpdateOutletDto) => o.entity,
    ignoreColumn: 'uuid',
  })
  name: string;

  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Outlet,
    ignoreValue: (o: UpdateOutletDto) => o.entity,
    ignoreColumn: 'uuid',
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  website: string;
}
