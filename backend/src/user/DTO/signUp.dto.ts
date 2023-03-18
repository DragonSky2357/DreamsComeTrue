import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'dragonsky2357',
    description: '아이디',
    required: true,
  })
  public userid: string;

  @ApiProperty({
    example: 'happyhappy!!',
    description: '비밀번호',
    required: true,
  })
  public password: string;

  @ApiProperty({
    example: 'dragonsky',
    description: '이름',
    required: true,
  })
  public username: string;

  @ApiProperty({
    example: 'dragonsky@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;
}
