import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    example: 'dragonsky2357',
    description: '아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public userid: string;

  @ApiProperty({
    example: 'happyhappy!!',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    example: 'dragonsky',
    description: '이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({
    example: 'dragonsky@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
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
