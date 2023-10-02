import { Comment } from './entities/comment.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Comment])],
  exports: [TypeOrmModule],
})
export class SharedModule {}
