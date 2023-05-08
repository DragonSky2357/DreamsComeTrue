import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  Response,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    const user = { userid: req.body.userid, password: req.body.password };
    return this.authService.login(user);
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Request() request) {
    const kakaoUser = request.user;
    return this.authService.kakaoLogin(kakaoUser);
  }
}
