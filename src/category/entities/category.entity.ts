import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import slugify from 'slugify';
import { Outlet } from '../../outlet/entities/outlet.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Outlet, (outlet) => outlet.categories)
  outlets: Outlet[];

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

  constructor(partial?: Partial<Category>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, {
      lower: true,
      trim: true,
      strict: true,
    });
  }
}
