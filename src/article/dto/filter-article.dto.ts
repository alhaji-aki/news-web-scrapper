import { IsOptional } from 'class-validator';
import { IsValidDateFormat } from '../../common/validators/date-format.validator';
import { format, parse } from 'date-fns';

export class FilterArticleDto {
  @IsOptional()
  tag: string;

  @IsOptional()
  outlet: string;

  @IsOptional()
  category: string;

  @IsOptional()
  @IsValidDateFormat(['dd-MM-yyyy', 'yyyy-MM-dd'])
  publishedAt: string;

  getFormatedPublishedAt(): string {
    const dateFormats = ['dd-MM-yyyy', 'yyyy-MM-dd'];

    try {
      for (const dateFormat of dateFormats) {
        const date = parse(this.publishedAt, dateFormat, new Date());

        if (date.toString() !== 'Invalid Date') {
          return format(date, 'yyyy-MM-dd');
        }
      }

      return;
    } catch (error) {
      return;
    }
  }
}
