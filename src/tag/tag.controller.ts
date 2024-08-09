import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';

@Controller('tags')
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
