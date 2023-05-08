import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Response,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { isHashValid } from '../common/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validate(userid: string, password: string): Promise<any> {
    const user = await this.userService.findOne(userid);

    if (user && (await isHashValid(password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const findUser = await this.validate(user.userid, user.password);

    if (!findUser) {
      throw new ForbiddenException({
        sucess: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: `등록되지 않은 사용자입니다.`,
        error: 'Forbidden',
      });
    }

    const payload = { username: findUser.username, email: findUser.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async kakaoLogin(kakaoUser: any) {
    const { provider, kakaoId, email, name } = kakaoUser;
    const findUser = await this.userService.findUserByKakao(
      provider,
      kakaoId,
      email,
    );

    if (findUser === null) {
      const createUser = {
        platform: provider,
        platformId: kakaoId,
        email,
        username: name,
      };
      await this.userRepository.save(createUser);
    }

    const payload = { provider, email, username: name };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
