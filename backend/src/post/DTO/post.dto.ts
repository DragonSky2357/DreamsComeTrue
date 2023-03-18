import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: '시바 이누 강아지가 저의 운명의 햄버거로 행운을 말해줬어요',
    description: '꿈의 제목을 넣는다.',
    required: true,
  })
  public title: string;

  @ApiProperty({
    example:
      '꿈에서 시바 강아지가 제가 제일 좋아 하는 음식 햄버거를 가지고 저의 미래를 보여주었는데 제가 앞으로 저의 꿈을 이룰 수 있을꺼라 했어요 ',
    description: '꿈의 내용을 넣는다.',
    required: true,
  })
  public bodyText: string;
}
