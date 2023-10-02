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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Exclude()
  id: number;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'password' })
  @Exclude()
  password: string;

  @Column('varchar', { name: 'username', unique: true })
  username: string;

  @Column('text', { name: 'avatar', nullable: true })
  avatar!: string;

  @Column('text', { name: 'introduce', nullable: true })
  introduce: string;

  @Column('varchar', { name: 'platform', nullable: true })
  @Exclude()
  platform: string;

  @Column('varchar', { name: 'platformId', unique: true, nullable: true })
  @Exclude()
  platformId: string;

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  currentRefreshTokenExp: Date;

  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: true,
  })
  post: Post[];

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

  @OneToMany(() => Comment, (comment) => comment.user)
  @JoinTable()
  comments: Comment[];

  @ManyToMany(() => Post, (post) => post.like_user)
  @JoinTable({
    name: 'user_like_post',
  })
  like_post?: Post[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
