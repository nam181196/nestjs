import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/category/entities/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/users/entities/role.enum';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body('name') name: string): Promise<Category> {
    return this.categoryService.create(name);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body('name') name: string): Promise<Category> {
    return this.categoryService.update(id, name);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
