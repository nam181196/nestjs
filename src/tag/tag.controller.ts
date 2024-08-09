import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body('name') name: string): Promise<Tag> {
    return this.tagService.create(name);
  }

  @Get()
  async findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Tag> {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body('name') name: string): Promise<Tag> {
    return this.tagService.update(id, name);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.tagService.remove(id);
  }
}
