import { Post } from '../../post/entity/post.entity';
import { User } from '../../user/entity/user.entity';
import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToMany(() => Post, (post) => post.like_users)
  posts: Post[];

  @CreateDateColumn({
    type: 'timestamp',
  })
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
}
