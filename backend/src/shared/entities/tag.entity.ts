import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './../../post/entity/post.entity';
import { User } from './../../user/entity/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.tags)
  users: User[];

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
