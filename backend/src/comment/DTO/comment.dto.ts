import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entity/post.entity';

export class CreateCommentDTO {
  @ApiProperty({
    example: '당신의 꿈을 응원합니다.',
    description: '댓글의 내용을 입력한다.',
    required: true,
  })
  public comment: string;

  @ApiProperty({
    example: '1',
    description: '포스트 아이디를 등록한다.',
    required: true,
  })
  public postId: number;

  @ApiProperty({
    example: '',
    description: '댓글 작성자를 등록한다.',
    required: true,
  })
  public writer: number;
}

export class CreateCommentSucessDTO {
  @ApiProperty({
    example: true,
    description: 'Create Comment Return Sucess Status',
    required: true,
  })
  public sucess: boolean;
}

export class CreateCommentFailDTO{
    @ApiProperty({
        example: false,
        description:"Create Comment Return Fail Status"
    })
}