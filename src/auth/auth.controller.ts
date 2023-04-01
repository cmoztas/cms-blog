import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';

interface LoginResponse {
  token: Promise<string>;
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const loginResponse: LoginResponse = await this.authService.login(userLoginDto);

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', loginResponse.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.send({ success: true, user: loginResponse.user });
  }
}
