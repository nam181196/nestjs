import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private async isCategoryNameUnique(name: string, excludeCategoryId?: number): Promise<boolean> {
    const categoryName = name.toLowerCase();
    const existingCategory = await this.categoryRepository.findOne({
      where: excludeCategoryId
        ? { name: categoryName, id: Not(excludeCategoryId) }
        : { name: categoryName }
    });
    return !existingCategory;
  }

  async create(name: string): Promise<Category> {
    if (!await this.isCategoryNameUnique(name)) {
      throw new BadRequestException('Danh mục với tên này đã tồn tại');
    }

    const category = this.categoryRepository.create({ name: name.toLowerCase() });
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async update(id: number, name: string): Promise<Category> {
    const category = await this.findOne(id);

    if (!await this.isCategoryNameUnique(name, id)) {
      throw new BadRequestException('Danh mục với tên này đã tồn tại');
    }

    category.name = name.toLowerCase();
    await this.categoryRepository.save(category);
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.delete(id);
  }
}