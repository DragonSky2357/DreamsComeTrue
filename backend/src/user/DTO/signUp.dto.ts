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

export class SignUpSuccessDto {
  @ApiProperty({
    example: true,
    description: 'success flag',
    required: true,
  })
  public sucess: boolean;

  @ApiProperty({
    example: 'success create user',
    description: 'success message',
    required: true,
  })
  public message?: string;
}

export class SignUpFailedDto {
  @ApiProperty({
    example: false,
    description: 'failed flag',
    required: true,
  })
  public sucess: boolean;

  @ApiProperty({
    example: 'failed create user',
    description: 'failed message',
    required: true,
  })
  public message: string;
}
