import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/random-image')
  getRandomImage(@Query('count') count = 1): Promise<any> {
    return this.postService.getRandomImage(count);
  }

  @Get('/search')
  searchPost(@Query() query): Promise<any> {
    const { title, describe } = query;
    return this.postService.searchPost(title, describe);
  }

  @Get('')
  getAllPost(): Promise<any> {
    return this.postService.getAllPost();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Promise<any> {
    return this.postService.getPostById(id);
  }

  @Post('')
  @UseGuards(JwtAccessGuard)
  create(@Request() req, @Body() createPostDto: CreatePostDto): Promise<any> {
    const { id } = req.user;
    return this.postService.createPost(id, createPostDto);
  }

  @Post('/createimage')
  createImage(@Body('title') title: string): Promise<any> {
    return this.postService.createImage(title);
  }

  @Get('/u/:username')
  getUserPost(@Param('username') username: string): Promise<any> {
    return this.postService.getUserPost(username);
  }

  @Patch('/:id/like')
  @UseGuards(JwtAccessGuard)
  updateLikeCount(@Request() req, @Param('id') id: string): Promise<any> {
    const { username } = req.user;
    return this.postService.updateLikeCount(username, id);
  }
}
