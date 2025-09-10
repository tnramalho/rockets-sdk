import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { OtpSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntityFixture } from './user.entity.fixture';

@Entity('user_otp')
export class UserOtpEntityFixture extends OtpSqliteEntity {
  @ManyToOne(() => UserEntityFixture, (user) => user.userOtps)
  assignee!: ReferenceIdInterface;
}