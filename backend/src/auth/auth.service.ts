import { SignUpDto } from './dto/signUp.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { hash, isHashValid } from '../common/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import Payload from './payload/payload.interface';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ sucess: boolean }> {
    const findUsername = await this.userService.findUserByName(
      signUpDto.username,
    );

    if (findUsername) {
      throw new BadRequestException({
        error: '사용할 수 없는 이름 입니다.',
      });
    }

    const findUser = await this.userService.findUserByEmail(signUpDto.email);

    if (findUser) {
      throw new BadRequestException({
        error: '이미 존재하는 유저입니다.',
      });
    }

    //await this.mailerService.sendHello(result.email);

    await this.userService.createUser(signUpDto);

    return { sucess: true };
  }

  async login(loginDto: LoginDto, res: Response): Promise<any> {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new HttpException(
        '존재하지 않은 사용자 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    // res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    // res.cookie('access_token', accessToken, {
    //   httpOnly: true,
    // });
    // res.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,
    // });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException({
        error: '등록되지 않은 유저 입니다.',
      });
    }

    if (user && (await isHashValid(loginDto.password, user.password))) {
      return user;
    }
    return null;
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
  async checkUser(user: User): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return { sucees: true };
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
