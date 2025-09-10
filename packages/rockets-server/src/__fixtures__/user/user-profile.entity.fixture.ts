import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserProfileSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntityFixture } from './user.entity.fixture';

@Entity('user_profile')
export class UserProfileEntityFixture extends UserProfileSqliteEntity {
  @Column({ type: 'text', nullable: true })
  firstName?: string;

  @Column({ type: 'text', nullable: true })
  lastName?: string;

  @Column({ type: 'integer', nullable: true })
  age?: number;

  @OneToOne(() => UserEntityFixture)
  @JoinColumn()
  user?: UserEntityFixture;
}