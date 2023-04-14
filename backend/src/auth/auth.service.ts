import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
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
        status: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: '잘못된 로그인 요청입니다.',
        error: 'Forbidden',
      });
    }

    const payload = { userid: findUser.userid, email: findUser.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async kakaoLogin(kakaoUser: any) {
    console.log(kakaoUser);
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
      const result = await this.userRepository.save(createUser);
    }
    console.log(findUser);
    return null;
  }
}
