import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Query,
  UseGuards,
  UploadedFile,
  BadRequestException,
  Res
} from '@nestjs/common';
import { DeleteReturn, PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Express, Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ACGuard, UseRoles } from 'nest-access-control';

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
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'posts'
  })
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

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req: Request, file: Express.Multer.File, cb: (error: (Error | null), filename: string) => void) => {
        const name: string = file.originalname.split('.')[0];
        const fileExtension: string = file.originalname.split('.')[1];
        const newFileName = `${name.split(' ').join('_')}_${Date.now()}.${fileExtension}`;

        cb(null, newFileName);
      }
    }),
    fileFilter: (req: any, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    }
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      const response: { filePath: string } = {
        filePath: `http://localhost:5000/posts/pictures/${file.filename}`
      };

      return response;
    }
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }

  @Patch(':slug')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'posts'
  })
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'posts'
  })
  remove(@Param('id') id: string): Promise<DeleteReturn> {
    return this.postService.remove(+id);
  }
}
