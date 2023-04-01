import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../auth/entities/user.entity';

export interface DeleteReturn {
  success: boolean;
  data: Post;
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>
  ) {
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post: Post = new Post();
    Object.assign(post, createPostDto);
    post.userId = user.id;
    return await this.repo.save(post);
  }

  async findAll(query?: string): Promise<Post[]> {
    const myQuery: SelectQueryBuilder<Post> =
      this.repo.createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.user', 'user');

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query);

      if (queryKeys.includes('title')) {
        myQuery.where('post.title LIKE :title', { title: `%${query['title']}%` });
      }

      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase());
      }

      if (queryKeys.includes('category')) {
        myQuery.andWhere('post.categoryId = :catId', { catId: query['category'] });
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async findOne(id: number): Promise<Post> {
    const post: Post = await this.repo.findOne({ where: { id: id } });
    if (!post) {
      throw new BadRequestException('Post Not Found');
    }
    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post: Post = await this.repo.findOne({ where: { slug: slug } });
    if (!post) {
      throw new BadRequestException(`Post With Slug ${slug} Not Found`);
    }

    return post;
  }

  async update(slug: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post: Post = await this.repo.findOneOrFail({ where: { slug: slug } });

    if (!post) {
      throw new BadRequestException('Post Not Found');
    }

    post.modified_on = new Date(Date.now());
    post.category = updatePostDto.category;

    Object.assign(post, updatePostDto);
    return this.repo.save(post);
  }

  async remove(id: number): Promise<DeleteReturn> {
    const post: Post = await this.repo.findOne({ where: { id: id } });

    if (!post) {
      throw new BadRequestException('Post Not Found');
    }

    await this.repo.remove(post);
    return <DeleteReturn>{ success: true, data: post };
  }
}
