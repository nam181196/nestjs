import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  address: string;

  @OneToMany(() => Product, product => product.ownerId)
  products: Product[];
}
