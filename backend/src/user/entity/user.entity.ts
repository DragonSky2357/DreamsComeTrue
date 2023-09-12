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
import { Comment } from '../../comment/entity/comment.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('varchar', { name: 'username', unique: true })
  username: string;

  @Column('varchar', { name: 'password' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column('varchar', { name: 'platform', nullable: true })
  @Exclude({ toPlainOnly: true })
  platform: string;

  @Column('varchar', { name: 'platformId', unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  platformId: string;

  @Column('text', { name: 'avatar', nullable: true })
  avatar!: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  @Exclude({ toPlainOnly: true })
  currentRefreshTokenExp: Date;

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: true,
  })
  post: Post[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  comment: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({ name: 'followers_following' })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @ManyToMany(() => Post, (post) => post.likeUser)
  likePost: Post[];

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
  deleted_at: Date | undefined;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
