import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'msp(d.)x666,tr',
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }])
    });
  }

  async validate(payload: any, req: Request): Promise<Express.User> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user: User = await this.repo.findOne({ where: { email: payload.email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    return req.user;
  }
}
