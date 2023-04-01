import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private jwtService: JwtService
  ) {
  }

  async login(loginDto: UserLoginDto) {
    console.log(loginDto);
    const user: User = await this.repo.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email }).getOne();

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    } else {
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token: Promise<string> = this.jwtService.signAsync({
          id: user.id,
          email: user.email
        });
        delete user.password;
        return { token, user };
      } else {
        throw new UnauthorizedException('Bad Credentials');
      }
    }
  }

  async verifyPassword(password: string, hash: string): Promise<any> {
    return await bcrypt.compare(password, hash);
  }

  async register(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const checkForUser = await this.repo.findOne({ where: { email } });

    console.log(email, checkForUser);

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
