import { Comment } from './../../shared/entities/comment.entity';
import { Tag } from './../../shared/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'avatar', nullable: true })
  avatar!: string;

  @Column({ name: 'introduce', nullable: true })
  introduce: string;

  @Column({ name: 'platform', nullable: true })
  @Exclude()
  platform: string;

  @Column({ name: 'platformId', unique: true, nullable: true })
  @Exclude()
  platformId: string;

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  currentRefreshTokenExp: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  created_at: Date | undefined;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  updated_at: Date | undefined;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  deleted_at: Date | undefined;

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: true,
  })
  post: Post[];

  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  comments: Comment[];

  @ManyToMany(() => Post, (post) => post.likedUser, {
    onDelete: 'CASCADE',
  })
  likedPosts: Post[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
