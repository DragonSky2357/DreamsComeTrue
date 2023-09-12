import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAccessGuard } from './jwt-access.guard';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('authenticate')
  @UseGuards(JwtAccessGuard)
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: number = req.user.id;
    const verifiedUser: User = await this.userService.findUserById(userId);
    return res.send(verifiedUser);
  }

  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.authService.refresh(refreshTokenDto, res);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  @Post('/signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signup(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.login(loginDto, res);
  }

  @Get('/logout')
  @UseGuards(JwtAccessGuard)
  async logout(@Request() req: any, @Res() res: Response): Promise<any> {
    console.log(req.user);
    return this.authService.logout(req.user, res);
  }

  @Get('/check')
  @UseGuards(JwtAccessGuard)
  async checkUser(@Request() req: any): Promise<any> {
    return this.authService.checkUser(req.user);
  }
  // @Get('/login/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async kakaoLogin(@Request() request) {
  //   const kakaoUser = request.user;
  //   return this.authService.kakaoLogin(kakaoUser);
  // }
}
