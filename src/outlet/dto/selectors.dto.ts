import { IsNotEmpty, MaxLength } from 'class-validator';

export class Selectors {
  @IsNotEmpty()
  @MaxLength(255)
  article_card: string;

  @IsNotEmpty()
  @MaxLength(255)
  link: string;

  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  date: string;

  @IsNotEmpty()
  @MaxLength(255)
  date_format: string;

  @IsNotEmpty()
  @MaxLength(255)
  tags: string;

  @IsNotEmpty()
  @MaxLength(255)
  image: string;

  @IsNotEmpty()
  @MaxLength(255)
  content: string;
}
