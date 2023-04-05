import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Post } from './../post/entity/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './DTO/comment.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createComment(createComment: CreateCommentDTO) {
    const { postId, writer, comment } = createComment;

    try {
      const findPost = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['post'],
      });

      if (findPost) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['존재 하지 않은 포스터 입니다.'],
          error: 'Forbidden',
        });
      }
    } catch (err) {}
  }
}
