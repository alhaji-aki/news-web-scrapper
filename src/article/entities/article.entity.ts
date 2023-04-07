import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import slugify from 'slugify';
import { Category } from '../../category/entities/category.entity';
import { Outlet } from '../../outlet/entities/outlet.entity';
import { Tag } from './tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  title: string;

  @Column({ name: 'published_at' })
  publishedAt: Date;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ unique: true })
  url: string;

  @Column('json')
  content: string[];

  @Column({ name: 'outlet_id' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  public outletId: number;

  @ManyToOne(() => Outlet, (outlet) => outlet.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;

  @Column({ name: 'category_id' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  public categoryId: number;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true,
  })
  @JoinTable({
    name: 'article_tag',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  constructor(partial?: Partial<Article>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, {
      lower: true,
      trim: true,
      strict: true,
    });
  }
}
