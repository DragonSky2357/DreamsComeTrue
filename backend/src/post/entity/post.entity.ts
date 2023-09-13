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
// import { Comment } from '../../comment/entity/comment.entity';

@Entity({ name: 'Post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'title' })
  title: string;

  @Column('text', { name: 'describe' })
  describe: string;

  @Column('text', { name: 'image' })
  image: string;

  // @OneToMany(() => Comment, (comment) => comment.post)
  // comment: Comment[];

  @ManyToOne(() => User, (user) => user.post, {})
  writer: User;

  @ManyToMany(() => User, (user) => user.likePost)
  @JoinTable({ name: 'likeuser_likepost' })
  likeUser: User[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date | undefined;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updated_at: Date | undefined;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
  })
  deleted_at: Date | undefined;

  constructor(post: Partial<Post>) {
    Object.assign(this, post);
  }
}
