import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, ClassSerializerInterceptor, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('ownerId') ownerId?: string): Promise<ProductResponseDto[]> {
    const parsedOwnerId = ownerId ? parseInt(ownerId, 10) : undefined;

    if (ownerId && isNaN(parsedOwnerId)) {
      throw new BadRequestException('Owner ID không hợp lệ');
    }

    const products = await this.productsService.findAll(parsedOwnerId);

    return products.map((product: Partial<ProductResponseDto>) => new ProductResponseDto(product));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const product = await this.productsService.findOne(productId);
    return new ProductResponseDto(product);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const updatedProduct = await this.productsService.update(productId, updateProductDto);
    return new ProductResponseDto(updatedProduct);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    await this.productsService.remove(productId);
  }
}
