import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDTO, CreateCommentSucessDTO } from './DTO/comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCommentDTO })
  @ApiCreatedResponse({ type: CreateCommentSucessDTO })
  createCommnet(@Request() request, @Body() createComment: any): Promise<any> {
    const { userid } = request.user;

    return this.commentService.createComment(userid, createComment);
  }
}
