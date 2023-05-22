import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../../category/entities/category.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty({message: 'Please enter something for the content'})
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  mainImageUrl: string;

  @IsOptional()
  category: Category;
}
