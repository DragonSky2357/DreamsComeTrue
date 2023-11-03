import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Comment } from './../shared/entities/comment.entity';
import { Tag } from './../shared/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tag, Comment])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
