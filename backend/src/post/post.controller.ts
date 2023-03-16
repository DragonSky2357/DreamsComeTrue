import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/makeImages')
  create(@Body() createPost: any): Promise<any> {
    return this.postService.create(createPost.data);
  }
}
