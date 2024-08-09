import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { Category } from 'src/category/entities/category.entity';
import { UpdateTagsDto } from '../tag/dto/update-tags.dto';
import { FindProductsDto } from './dto/find-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private async isProductNameUnique(name: string, excludeProductId?: number): Promise<boolean> {
    const productName = name.toLowerCase();
    const existingProduct = await this.productsRepository.findOne({
      where: excludeProductId
        ? { name: productName, id: Not(excludeProductId) }
        : { name: productName }
    });
    return !existingProduct;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, tagIds, categoryId, ...productData } = createProductDto;

    if (!await this.isProductNameUnique(name)) {
      throw new BadRequestException('Sản phẩm với tên này đã tồn tại');
    }

    const product = this.productsRepository.create({
      ...productData,
      name: name.toLowerCase(),
    });

    if (tagIds && tagIds.length > 0) {
      product.tags = await this.tagsRepository.find({
        where: tagIds.map(id => ({ id }))
      });
    }

    if (categoryId) {
      product.category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    }

    return this.productsRepository.save(product);
  }

  async findAll(findProductsDto: FindProductsDto): Promise<Product[]> {
    const { categoryId, tagIds } = findProductsDto;

    const queryBuilder = this.productsRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.tags', 'tag');

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (tagIds && tagIds.length > 0) {
      queryBuilder
        .andWhere('tag.id IN (:...tagIds)', { tagIds });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['tags', 'category'],
    });

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { name, tagIds, categoryId, ...productData } = updateProductDto;

    let product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    if (name && name.toLowerCase() !== product.name) {
      if (!await this.isProductNameUnique(name, id)) {
        throw new BadRequestException('Sản phẩm với tên này đã tồn tại');
      }
      product.name = name.toLowerCase();
    }

    if (tagIds && tagIds.length > 0) {
      product.tags = await this.tagsRepository.find({
        where: tagIds.map(id => ({ id }))
      });
    }

    if (categoryId) {
      product.category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    }

    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async updateTags(id: number, updateTagsDto: UpdateTagsDto): Promise<Product> {
    const { tagIds } = updateTagsDto;

    let product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    product.tags = await this.tagsRepository.find({
      where: tagIds.map(id => ({ id })),
    });

    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    await this.productsRepository.delete(id);
  }
}
