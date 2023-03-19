import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: '바다에서 큰 물고기를 잡았어요',
    description: '꿈의 제목을 넣는다.',
    required: true,
  })
  public title: string;

  @ApiProperty({
    example:
      '여름철 바다로 놀러가서 큰 물고기를 잡았는데 그 물고기가 제가 처음 잡아보는 물고기였어요',
    description: '꿈의 내용을 넣는다.',
    required: true,
  })
  public bodyText: string;
}
