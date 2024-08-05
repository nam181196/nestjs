import { Exclude, Expose, Type } from 'class-transformer';
import { Product } from 'src/products/entities/product.entity';
import { Role } from '../entities/role.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  address: string;

  @Expose()
  @Type(() => Product)
  products: Product[];

  @Expose()
  role: Role;


  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
