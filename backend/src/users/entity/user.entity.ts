import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
