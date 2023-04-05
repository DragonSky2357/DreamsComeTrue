import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDTO {
  @ApiProperty({
    example: '당신의 꿈을 응원합니다.',
    description: '댓글의 내용을 입력한다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public comment: string;

  @ApiProperty({
    example: '1',
    description: '포스트 아이디를 등록한다.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public postId: number;
}

export class CreateCommentSucessDTO {
  @ApiProperty({
    example: true,
    description: 'Create Comment Return Sucess Status',
    required: true,
  })
  public sucess: boolean;
}

export class CreateCommentFailDTO {
  @ApiProperty({
    example: false,
    description: 'Create Comment Return Fail Status',
    required: true,
  })
  public sucess: false;
}
