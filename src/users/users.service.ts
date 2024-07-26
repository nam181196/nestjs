import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordStrengthService } from './password-strength.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordStrengthService: PasswordStrengthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const lowerCaseUsername = createUserDto.username.toLowerCase();
    const lowerCaseEmail = createUserDto.email.toLowerCase();
  
    // Check if the username already exists
    const existingUser = await this.usersRepository.findOne({ where: { username: lowerCaseUsername } });
    if (existingUser) {
      throw new BadRequestException('Username đã tồn tại');
    }
  
    // Check if the email already exists
    const existingEmail = await this.usersRepository.findOne({ where: { email: lowerCaseEmail } });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }
  
    // Check password strength
    const passwordStrength = this.passwordStrengthService.checkStrength(createUserDto.password);
    if (passwordStrength.score < 3) {
      throw new BadRequestException('Mật khẩu yếu, hãy chọn một mật khẩu mạnh hơn');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
  
    // Create a new user
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      username: lowerCaseUsername,
      email: lowerCaseEmail,
    });
  
    // Save the new user
    const savedUser = await this.usersRepository.save(newUser);
    return plainToInstance(UserResponseDto, savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return plainToInstance(UserResponseDto, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    // Check if the user exists
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle username and email uniqueness
    if (updateUserDto.username) {
      const lowerCaseUsername = updateUserDto.username.toLowerCase();
      const existingUser = await this.usersRepository.findOne({ where: { username: lowerCaseUsername } });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Username đã tồn tại');
      }
      updateUserDto.username = lowerCaseUsername;
    }

    if (updateUserDto.email) {
      const lowerCaseEmail = updateUserDto.email.toLowerCase();
      const existingEmail = await this.usersRepository.findOne({ where: { email: lowerCaseEmail } });
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException('Email đã tồn tại');
      }
      updateUserDto.email = lowerCaseEmail;
    }

    if (updateUserDto.password) {
      const passwordStrength = this.passwordStrengthService.checkStrength(updateUserDto.password);
      if (passwordStrength.score < 3) {
        throw new BadRequestException('Mật khẩu yếu, hãy chọn một mật khẩu mạnh hơn');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }

    await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username: username.toLowerCase() } });
    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }
}
