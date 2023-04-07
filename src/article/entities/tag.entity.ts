import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import slugify from 'slugify';
import { Article } from './article.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

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

  constructor(partial?: Partial<Tag>) {
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
