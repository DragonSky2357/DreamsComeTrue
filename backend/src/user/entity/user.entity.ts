import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Comment } from '../../comment/entity/comment.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'userid', unique: true })
  userid: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'username' })
  username: string;

  @Column('varchar', { name: 'email' })
  email: string;

  @Column('text', { name: 'profileImageUrl', nullable: true })
  profileImageURL!: string;

  @OneToMany(() => Post, (post) => post.writer)
  post: Post[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  comment: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({ name: 'followers_following' })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

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
