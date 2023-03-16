import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;
  @ApiProperty({
    example: 'dragonsky',
    description: '닉네임',
    required: true,
  })
  public nickname: string;
  @ApiProperty({
    example: 'happyhappy!!',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
