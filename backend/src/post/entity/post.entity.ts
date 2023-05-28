import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { Comment } from '../../comment/entity/comment.entity';

@Entity({ name: 'Post' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title' })
  title: string;

  @Column('text', { name: 'bodyText' })
  bodyText: string;

  @Column('text', { name: 'imageUrl' })
  imageUrl: string;

  @Column('int', { name: 'rating', default: 1 })
  rating: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @ManyToOne(() => User, (user) => user.post)
  writer: User;

  @ManyToMany(() => User, (user) => user.likePost)
  @JoinTable({ name: 'likeuser_likepost' })
  likeUser: User[];

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
