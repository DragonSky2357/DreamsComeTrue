import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { Post } from '../../post/entity/post.entity';

@Entity({ name: 'Comment' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'comment' })
  comment: string;

  @Column('int', { name: 'likeCount', default: 0 })
  likeCount: number;

  @ManyToOne(() => Post, (post) => post.comment)
  post: Post;

  @ManyToOne(() => User, (user) => user.comment)
  writer: User;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date | undefined;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date | undefined;
}
