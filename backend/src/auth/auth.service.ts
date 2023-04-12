import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { isHashValid } from '../common/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
}
