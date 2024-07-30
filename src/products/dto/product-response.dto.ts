import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => UserResponseDto)
  @Expose()
  owner: UserResponseDto;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
