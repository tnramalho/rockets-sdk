import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { Entity, OneToMany, Column } from 'typeorm';
import { UserOtpEntityFixture } from './user-otp.entity.fixture';
import { FederatedEntityFixture } from '../federated/federated.entity.fixture';

@Entity('user')
export class UserEntityFixture extends UserSqliteEntity {
  @Column({ type: 'integer', nullable: true })
  age?: number;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @OneToMany(() => UserOtpEntityFixture, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntityFixture[];

  @OneToMany(() => FederatedEntityFixture, (federated) => federated.assignee)
  federatedAccounts?: FederatedEntityFixture[];
}