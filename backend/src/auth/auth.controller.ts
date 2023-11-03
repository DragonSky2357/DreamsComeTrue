import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { JwtAccessGuard } from './jwt/jwt-access.guard';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Login } from './response/login-response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('authenticate')
  @UseGuards(JwtAccessGuard)
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: string = req.user.id;
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
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signup(signUpDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Login> {
    return this.authService.login(loginDto);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  async logout(@Request() req: any, @Res() res: Response): Promise<void> {
    return this.authService.logout(req.user, res);
  }

  @Get('/check')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  async checkUser(@Request() req: any): Promise<void> {
    return this.authService.checkUser(req.user);
  }

  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  deleteUser(@Req() req): Promise<any> {
    return this.userService.deleteUser(req.user.id, req.user.email);
  }
}
