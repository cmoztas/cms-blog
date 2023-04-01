import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe, UseInterceptors, ClassSerializerInterceptor, Req, Query
} from '@nestjs/common';
import { DeleteReturn, PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { User } from '../auth/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createPostDto: CreatePostDto, @Req() req: AuthRequest): Promise<PostEntity> {
    return this.postService.create(createPostDto, <User>req.user);
  }

  @Get()
  findAll(@Query() query: string): Promise<PostEntity[]> {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(+id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postService.findBySlug(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteReturn> {
    return this.postService.remove(+id);
  }
}
