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
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Exclude()
  id: number;

  @Column('varchar', { name: 'email' })
  @Exclude()
  email: string;

  @Column('varchar', { name: 'username', unique: true })
  username: string;

  @Column('varchar', { name: 'password' })
  @Exclude()
  password: string;

  @Column('varchar', { name: 'platform', nullable: true })
  @Exclude()
  platform: string;

  @Column('varchar', { name: 'platformId', unique: true, nullable: true })
  @Exclude()
  platformId: string;

  @Column('text', { name: 'avatar', nullable: true })
  avatar!: string;

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  @Exclude()
  currentRefreshTokenExp: Date;

  @OneToMany(() => Post, (post) => post.writer, {
    cascade: true,
  })
  post: Post[];

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
  @Exclude()
  deleted_at: Date | undefined;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
