import { Category } from '../../category/entities/category.entity';
import { Outlet } from '../../outlet/entities/outlet.entity';

export class CreateArticleDto {
  title: string;

  publishedAt: Date;

  imageUrl: string;

  url: string;

  content: string[];

  outlet: Outlet;

  category: Category;

  tags: string[];
}
