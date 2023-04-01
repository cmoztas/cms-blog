import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>
  ) {
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category: Category = new Category();
    Object.assign(category, createCategoryDto);
    return await this.repo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category: Category = await this.repo.findOne({ where: { id: id } });

    if (!category) {
      throw new BadRequestException('Category Not Found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
    return await this.repo.update(id, updateCategoryDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.repo.delete(id);
  }
}
