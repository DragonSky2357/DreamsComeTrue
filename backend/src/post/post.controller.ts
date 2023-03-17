import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createPost: any, @Request() req): Promise<any> {
    const { userid, email } = req.user;
    return this.postService.create(userid, createPost);
  }
}
