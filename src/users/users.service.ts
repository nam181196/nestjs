import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { username: createUserDto.username } });
    if (existingUser) {
      throw new BadRequestException('Username đã tồn tại');
    }

    const existingEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
    await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }
}
