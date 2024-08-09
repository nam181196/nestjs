import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, ClassSerializerInterceptor, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FindProductsDto } from './dto/find-product.dto';
import { UpdateTagsDto } from '../tag/dto/update-tags.dto';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() query: any) {
    if (query.tagIds) { 
      if (typeof query.tagIds === 'string') {  //Nếu là tagIds là mảng -> số nguyên
        query.tagIds = query.tagIds.split(',').map(id => parseInt(id, 10));
      } else if (!Array.isArray(query.tagIds)) {
        throw new BadRequestException('tagIds must be an array');
      }
    }

    const findProductsDto = new FindProductsDto();
    Object.assign(findProductsDto, query);
  
    return this.productsService.findAll(findProductsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const product = await this.productsService.findOne(productId);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const updatedProduct = await this.productsService.update(productId, updateProductDto);
    return new ProductResponseDto(updatedProduct);
  }

  @Patch(':id/tags')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTags(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto): Promise<ProductResponseDto> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const updatedProduct = await this.productsService.updateTags(productId, updateTagsDto);
    return new ProductResponseDto(updatedProduct);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<void> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    await this.productsService.remove(productId);
  }
}
