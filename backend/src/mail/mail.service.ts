import { ConflictException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PostService } from '../post/post.service';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  sendHello(email: string): boolean {
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('EMAIL_ID'),
        subject: '⭐⭐⭐⭐⭐ Welcome to Dreams Member ⭐⭐⭐⭐⭐',
        text: 'Hello World',
        html: `<div><h1>Dreams Come True에 가입해주셔서 감사합니다.</h1>    
        <h3>당신의 꿈을 들려주세요</h3>
        <img src=https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/0e8897bf-f7f4-4a8f-9abf-bfa07c169d57.png> </div>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    return true;
  }
}
