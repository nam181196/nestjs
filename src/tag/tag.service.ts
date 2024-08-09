import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  private async isTagNameUnique(name: string, excludeTagId?: number): Promise<boolean> {
    const tagName = name.toLowerCase();
    const existingTag = await this.tagRepository.findOne({
      where: excludeTagId
        ? { name: tagName, id: Not(excludeTagId) }
        : { name: tagName }
    });
    return !existingTag;
  }

  async create(name: string): Promise<Tag> {
    if (!await this.isTagNameUnique(name)) {
      throw new BadRequestException('Tag với tên này đã tồn tại');
    }

    const tag = this.tagRepository.create({ name: name.toLowerCase() });
    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    try {
      return await this.tagRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  async update(id: number, name: string): Promise<Tag> {
    const tag = await this.findOne(id);

    if (!await this.isTagNameUnique(name, id)) {
      throw new BadRequestException('Tag với tên này đã tồn tại');
    }

    tag.name = name.toLowerCase();
    await this.tagRepository.save(tag);
    return tag;
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.delete(id);
  }
}
