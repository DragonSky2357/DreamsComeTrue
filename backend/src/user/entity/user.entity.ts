import {
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

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followers_id' })
  followers: User[];

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
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
