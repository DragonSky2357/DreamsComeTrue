import { User } from './../user/entity/user.entity';
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
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpStatusCode } from 'axios';

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
    const { search } = query;
    return this.postService.searchPost(search);
  }

  @Get('/tag/:tagname')
  getTagPost(@Param('tagname') tagname: string): Promise<any> {
    return this.postService.getTagPost(tagname);
  }

  @Get('')
  getAllPost(): Promise<any> {
    return this.postService.getAllPost();
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  getPostById(@Request() req, @Param('id') postId: string): Promise<any> {
    const { id } = req.user;
    return this.postService.getPostById(id, postId);
  }

  @Post('')
  @UseGuards(JwtAccessGuard)
  create(@Request() req, @Body() createPostDto: CreatePostDto): Promise<any> {
    const { id } = req.user;
    return this.postService.createPost(id, createPostDto);
  }

  @Post('/createimage')
  @HttpCode(HttpStatusCode.Created)
  createImage(@Body('title') title: string): Promise<any> {
    return this.postService.createImage(title);
  }

  @Get('/u/:username')
  getUserPost(@Param('username') username: string): Promise<any> {
    return this.postService.getUserPost(username);
  }

  @Get('/:id/comments')
  @UseGuards(JwtAccessGuard)
  getCommentsById(@Param('id') postId: string): Promise<any> {
    return this.postService.getCommentsById(postId);
  }

  @Get('/:id/comment/:commentId')
  @UseGuards(JwtAccessGuard)
  getCommentById(
    @Param('id') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<any> {
    return this.postService.getCommentById(postId, commentId);
  }

  @Post('/:id/comment')
  @UseGuards(JwtAccessGuard)
  createComment(
    @Request() req,
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<any> {
    return this.postService.createComment(
      req.user.id,
      postId,
      createCommentDto,
    );
  }

  @Patch(':id/like')
  @UseGuards(JwtAccessGuard)
  updateLikePost(@Request() req, @Param('id') postId: string): Promise<any> {
    return this.postService.updatePostLike(req.user.id, postId);
  }
}
