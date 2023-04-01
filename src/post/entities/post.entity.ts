import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import slugify from 'slugify';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  modified_on: Date;

  @Column()
  mainImageUrl: string;

  @Column()
  userId: number;

  @Column({ default: 3 })
  categoryId: number;

  @ManyToOne(() => User, (user: User) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (c: Category) => c.post)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @BeforeInsert()
  slugifyPost(): void {
    this.slug = slugify(this.title.substring(0, 20), {
      lower: true,
      replacement: '_'
    })
  }
}
