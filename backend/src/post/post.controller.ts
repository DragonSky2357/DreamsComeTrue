import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreatePostDTO,
  CreatePostSuccessDTO,
  CreatePostFailDTO,
} from './DTO/post.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreatePostDTO })
  @ApiCreatedResponse({
    description: 'The user was created successfully.',
    type: CreatePostSuccessDTO,
  })
  @ApiBadRequestResponse({
    description: 'User creation failed.',
    type: CreatePostFailDTO,
  })
  create(@Body() createPost: any, @Request() req): Promise<any> {
    const { userid } = req.user;
    return this.postService.createPost(userid, createPost);
  }

  @Get('')
  getAllPost(): Promise<any> {
    return this.postService.getAllPost();
  }

  @Get('/search')
  searchPost(@Query() query): Promise<any> {
    const { title, content } = query;

    return this.postService.searchPost(title, content);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) postId: number): Promise<any> {
    return this.postService.getPostById(postId);
  }
}
