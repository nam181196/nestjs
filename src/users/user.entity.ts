import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;
}
