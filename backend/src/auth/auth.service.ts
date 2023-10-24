import { ResponseResult } from './../common/dto/Response';
import { SignUpDto } from './dto/signUp.dto';
import {
  HttpStatus,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { isHashValid } from '../common/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import Payload from './payload/payload.interface';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<void> {
    const findUserByEmail = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (findUserByEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const findUserName = await this.userRepository.findOne({
      where: {
        username: signUpDto.username,
      },
    });

    if (findUserName) {
      throw new ConflictException('이미 존재하는 유저 이름입니다.');
    }

    await this.userService.createUser(signUpDto);
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('존재하지 않은 회원입니다.');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      avatar: user.avatar,
      username: user.username,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) return null;

    if (user && (await isHashValid(loginDto.password, user.password))) {
      return user;
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.signAsync(payload);
  }

  generateRefreshToken(user: User): Promise<string> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRE_TIME',
        ),
      },
    );
  }

  async refresh(refreshTokenDto: RefreshTokenDto, res: Response): Promise<any> {
    const { refresh_token } = refreshTokenDto;

    const decodedRefreshToken = this.jwtService.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    }) as Payload;

    const userId = decodedRefreshToken.id;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refresh_token,
      userId,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const accessToken = await this.generateAccessToken(user);

    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
  }

  async logout(user: User, res: Response) {
    await this.userService.removeRefreshToken(user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.send({ sucess: true });
  }

  async checkUser(user: User): Promise<void> {
    if (!user) {
      throw new UnauthorizedException(
        '확인 되지 않은 사용자입니다. 다시 로그인 해주세요',
      );
    }
  }
}
