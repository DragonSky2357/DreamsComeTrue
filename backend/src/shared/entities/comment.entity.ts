import { User } from './../../user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Post } from '../../post/entity/post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.comments)
  writer: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @CreateDateColumn({})
  created_at: Date | undefined;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date | undefined;

  @DeleteDateColumn()
  @Exclude()
  deleted_at: Date | undefined;
}
