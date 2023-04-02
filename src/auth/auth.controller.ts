import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

interface LoginResponse {
  token: string;
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response): Promise<Response> {
    const loginResponse: LoginResponse = await this.authService.login(userLoginDto);

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', loginResponse.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.send({ success: true, user: loginResponse.user });
  }

  @Post('register')
  async userRegistration(@Body() userCreateDto: CreateUserDto): Promise<User> {
    return this.authService.register(userCreateDto);
  }
}
