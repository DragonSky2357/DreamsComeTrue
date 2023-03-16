import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'userId', unique: true, length: 20 })
  userid: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'username', length: 20 })
  username: string;

  @Column('varchar', { name: 'email', length: 20 })
  email: string;

  @OneToMany(() => Post, (post) => post.writer)
  posts: Post[];
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
