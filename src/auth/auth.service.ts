import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Role } from 'src/users/entities/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser({ username, password }: AuthPayloadDto): Promise<any> {
    const isValid = await this.usersService.validateUser(username, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.usersService.findOneWithPassword(username);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = {
      ...createUserDto,
      role: createUserDto.role || Role.User,
    };
    const user = await this.usersService.create(newUser);
    return user;
  }
}

