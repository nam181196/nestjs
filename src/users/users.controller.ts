import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from './entities/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/with-password')
  async findOneWithPassword(@Param('username') username: string) {
    return this.usersService.findOneWithPassword(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    await this.usersService.update(userId, updateUserDto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role
  ) {
    await this.usersService.updateRole(id, role);
    return { message: 'Role cập nhật thành công' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    await this.usersService.remove(userId);
  }
}
