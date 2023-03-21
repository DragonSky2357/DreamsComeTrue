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
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreatePostDto,
  CreatePostFailedDto,
  CreatePostSuccessDto,
} from './DTO/post.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    description: 'The user was created successfully.',
    type: CreatePostSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'User creation failed.',
    type: CreatePostFailedDto,
  })
  create(@Body() createPost: any, @Request() req): Promise<any> {
    const { userid, email } = req.user;
    return this.postService.createPost(userid, createPost);
  }

  @Get('')
  getAllPost(): Promise<any> {
    return this.postService.getAllPost();
  }
}
