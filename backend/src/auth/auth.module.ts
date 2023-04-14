import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KakaoStrategy } from './kakao.strategy';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, KakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
