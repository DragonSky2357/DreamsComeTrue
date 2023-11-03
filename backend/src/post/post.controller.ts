import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Query,
  HttpCode,
  Req,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessGuard } from 'src/auth/jwt/jwt-access.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpStatusCode } from 'axios';
import { Post as post } from './entity/post.entity';
import { IPost } from './interface/post.interface';
import { UpdatePostDto } from './dto/update-post-dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/random-image')
  getRandomImage(@Query('count') count = 1): Promise<{ image: string[] }> {
    return this.postService.getRandomImage(count);
  }

  @Get('/ranking')
  @UseGuards(JwtAccessGuard)
  getPostByRanking(@Query('count') count = 10): Promise<any> {
    return this.postService.getPostByRanking(count);
  }

  @Get('/search')
  @UseGuards(JwtAccessGuard)
  getSearchPost(@Query() query): Promise<any> {
    console.log(123);
    const { search } = query;
    return this.postService.getSearchPost(search);
  }

  @Get('/tag/:tagname')
  @UseGuards(JwtAccessGuard)
  getTagPost(@Param('tagname') tagname: string): Promise<any> {
    return this.postService.getTagPost(tagname);
  }

  @Post('/createimage')
  @HttpCode(HttpStatusCode.Created)
  createImage(@Body('title') title: string): Promise<any> {
    return this.postService.createImage(title);
  }

  @Get('')
  @UseGuards(JwtAccessGuard)
  getAllPost(): Promise<post[]> {
    return this.postService.getAllPost();
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  getPostById(@Req() req, @Param('id') postId: string): Promise<IPost> {
    return this.postService.getPostById(req.user.id, postId);
  }

  @Post('')
  @UseGuards(JwtAccessGuard)
  createPost(@Req() req, @Body() createPostDto: CreatePostDto): Promise<any> {
    return this.postService.createPost(req.user.id, createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  updatePost(
    @Req() req,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const { id } = req.user;
    return this.postService.updatePost(id, postId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  deletePost(@Req() req, @Param('id') postId: string) {
    const { id } = req.user;
    return this.postService.deletePost(id, postId);
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
    @Req() req,
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
  updateLikePost(@Req() req, @Param('id') postId: string): Promise<any> {
    return this.postService.updatePostLike(req.user.id, postId);
  }
}
