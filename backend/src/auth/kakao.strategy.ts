import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: process.env.KAKAO_LOGIN_CLIENT_ID,
      callbackURL: process.env.KAKAO_LOGIN_CALLBACK_URL,
    });
  }

  async validate(accessToken: any, refreshToken: any, profile: any, done: any) {
    const profileJson = profile._json;
    const provider = profile.provider;

    const kakao_account = profileJson.kakao_account;
    const payload: any = {
      provider,
      name: kakao_account.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakao_account.has_email && !kakao_account.email_needs_agreement
          ? kakao_account.email
          : null,
    };

    done(null, payload);
  }
}
