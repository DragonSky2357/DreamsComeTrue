import { Comment } from './../../shared/entities/comment.entity';
import { Tag } from './../../shared/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { Exclude } from 'class-transformer';
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

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.post, {})
  @JoinColumn({ referencedColumnName: 'id' })
  writer: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinTable()
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.like_post)
  like_user: User[];

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
  @Exclude()
  deleted_at: Date | undefined;

  constructor(post: Partial<Post>) {
    Object.assign(this, post);
  }
}
