import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>
  ) {
  }

  async create(createPostDto: CreatePostDto): Promise<InsertResult> {
    const slug: string = createPostDto.title.split(" ").join("_").toLowerCase();

    return await this.repo.insert({ ...createPostDto, slug });
  }

  async findAll(): Promise<Post[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Post> {
    const post: Post = await this.repo.findOne({ where: { id: id } });
    if (!post) {
      throw new BadRequestException("Post Not Found");
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
    return await this.repo.update(id, updatePostDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.repo.delete(id);
  }
}
