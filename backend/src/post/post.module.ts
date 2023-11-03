import { Comment } from './../shared/entities/comment.entity';
import { Tag } from './../shared/entities/tag.entity';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { OpenAIModule } from '@platohq/nestjs-openai';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entity/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, Tag]),
    OpenAIModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get<string>('OPENAI_API_KEY'),
      }),
    }),
    HttpModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
