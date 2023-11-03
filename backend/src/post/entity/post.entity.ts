import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { Exclude } from 'class-transformer';
import { Comment } from './../../shared/entities/comment.entity';
import { Tag } from './../../shared/entities/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'title' })
  title: string;

  @Column('text', { name: 'describe' })
  describe: string;

  @Column('varchar', { name: 'image' })
  image: string;

  @ManyToOne(() => User, (user) => user.post, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  writer: User;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'post_tag',
  })
  tags: Tag[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'post_view',
  })
  views: User[];

  @Column({ default: 0 })
  views_count: number;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'like_user' })
  like_users: User[];

  @Column({ default: 0 })
  likes_count: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date | undefined;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date | undefined;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  deleted_at: Date | undefined;

  constructor(post: Partial<Post>) {
    Object.assign(this, post);
  }
}
