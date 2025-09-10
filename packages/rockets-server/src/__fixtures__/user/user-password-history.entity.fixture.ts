import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { UserPasswordHistorySqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntityFixture } from './user.entity.fixture';

@Entity('user_password_history')
export class UserPasswordHistoryEntityFixture extends UserPasswordHistorySqliteEntity {
  @ManyToOne(() => UserEntityFixture)
  assignee!: ReferenceIdInterface;
}