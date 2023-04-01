import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

interface LoginResponse {
  token: Promise<string>;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private jwtService: JwtService
  ) {
  }

  async login(loginDto: UserLoginDto): Promise<LoginResponse> {
    const user: User = await this.repo.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email }).getOne();

    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    } else {
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token: Promise<string> = this.jwtService.signAsync({
          id: user.id,
          email: user.email
        });
        delete user.password;
        return <LoginResponse>{ token, user };
      } else {
        throw new UnauthorizedException('Bad Credentials');
      }
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email }: CreateUserDto = createUserDto;

    const checkForUser: User = await this.repo.findOne({ where: { email } });

    if (checkForUser) {
      throw new BadRequestException('Email is already registered');
    } else {
      const user: User = new User();
      Object.assign(user, createUserDto);
      this.repo.create(user);
      await this.repo.save(user);
      delete user.password;
      return user;
    }
  }
}
