import { Controller, Get, Post, UseGuards, Req, Res, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interface/auth.types';
import { Response } from 'express';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const { accessToken } = await this.authService.login(req.user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    return res.send({ message: 'Đăng nhập thành công' });
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);
    return { message: 'Đăng ký thành công', user };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return { message: 'User is authenticated', user: req.user };
  }
}
