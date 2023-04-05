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

  async createComment(userid: string, createComment: CreateCommentDTO) {
    const { postId, comment } = createComment;

    try {
      const findUser = await this.userRepository.findOne({
        where: { userid },
        relations: ['comment'],
      });

      console.log(findUser);

      if (!findUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['존재 하지 않은 유저 입니다.'],
          error: 'Forbidden',
        });
      }

      const findPost = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['comment'],
      });

      console.log(findPost);

      if (!findPost) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['존재 하지 않은 포스터 입니다.'],
          error: 'Forbidden',
        });
      }

      const newComment = {
        comment,
        post: findPost,
        writer: findUser,
      };

      const saveComment = await this.commentRepository.save(newComment);

      console.log(saveComment);

      await findUser.comment.push(saveComment);
      await findPost.comment.push(saveComment);

      return {
        sucess: true,
        message: 'create comment success',
      };
    } catch (err) {}
  }
}
