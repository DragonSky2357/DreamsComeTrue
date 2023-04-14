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
import { isHashValid } from '../../common/utils/utils';
import { Exclude } from 'class-transformer';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Exclude()
  @Column('varchar', { name: 'userid', unique: true, nullable: true })
  userid: string;

  @Column('varchar', { name: 'platform', nullable: true })
  platform: string;

  @Exclude()
  @Column('varchar', { name: 'platformId', unique: true, nullable: true })
  platformId: string;

  @Exclude({ toPlainOnly: true })
  @Column('varchar', { name: 'password', nullable: true })
  password: string;

  @Column('varchar', { name: 'username', unique: true, nullable: true })
  username: string;

  @Exclude()
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

  // validatePassword(comparePassword: string) {
  //   if (!this.password || !comparePassword) {
  //     return false;
  //   }
  //   return isHashValid(this.password, comparePassword);
  // }
}
