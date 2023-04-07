import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';
import { Outlet } from './outlet.entity';

@Entity('category_outlet')
export class OutletCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ name: 'outlet_id' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  public outletId: number;

  @ManyToOne(() => Outlet, (outlet) => outlet.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'outlet_id' })
  public outlet: Outlet;

  @Column({ name: 'category_id' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  public categoryId: number;

  @ManyToOne(() => Category, (category) => category.outlets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  public category: Category;

  @Column({ unique: true })
  link: string;

  @Column('json')
  selectors: {
    article_card: string;
    link: string;
    title: string;
    date: string;
    tags: string;
    image: string;
    content: string;
  };

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

  constructor(partial?: Partial<OutletCategory>) {
    Object.assign(this, partial);
  }
}
