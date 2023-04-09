import { Module } from '@nestjs/common';
import { UniqueValidator } from './unique.validator';
import { ExistsValidator } from './exists.validator';
import { DateFormatValidator } from './date-format.validator';

@Module({
  providers: [UniqueValidator, ExistsValidator, DateFormatValidator],
})
export class ValidatorModule {}
