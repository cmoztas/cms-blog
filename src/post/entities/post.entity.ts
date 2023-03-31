import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_on: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  modified_on: Date;

  @Column()
  mainImageUrl: string;
}
