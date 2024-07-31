import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(ownerId?: number): Promise<Product[]> {
    return this.productsRepository.find({
      where:{ ownerId: { id: ownerId}},
      relations: ['ownerId'],
      select: {
        ownerId: {
          id: true,
          username: true,
          email: true,
          address: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['ownerId'],
      select: {
        ownerId: {
          id: true,
          username: true,
          email: true,
          address: true,
        },
      },
    });

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }
    await this.productsRepository.update(id, updateProductDto);
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