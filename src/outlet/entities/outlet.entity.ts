import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { OutletCategory } from './outlet-category.entity';
import { Article } from '../../article/entities/article.entity';

@Entity('outlets')
export class Outlet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  website: string;

  @OneToMany(() => OutletCategory, (OutletCategory) => OutletCategory.outlet, {
    cascade: true,
  })
  public categories: OutletCategory[];

  @OneToMany(() => Article, (article) => article.outlet)
  public articles: Article[];

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

  constructor(partial?: Partial<Outlet>) {
    Object.assign(this, partial);
  }
}
