import { IsString, IsNumber, IsNotEmpty, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  tagIds?: number[];

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
