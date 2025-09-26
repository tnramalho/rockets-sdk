import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { Entity, OneToMany, OneToOne, Column } from 'typeorm';
import { UserUserMetadataEntityFixture } from './user-metadata.entity.fixture';
import { UserOtpEntityFixture } from './user-otp-entity.fixture';
import { UserRoleEntityFixture } from '../role/user-role.entity.fixture';
import { RoleAssignmentSqliteEntity } from '@concepta/nestjs-typeorm-ext';

@Entity()
export class UserFixture extends UserSqliteEntity {
  @Column({ type: 'integer', nullable: true })
  age?: number;

  @OneToOne(
    () => UserUserMetadataEntityFixture,
    (userUserMetadata) => userUserMetadata.user,
  )
  userUserMetadata?: UserUserMetadataEntityFixture;
  @OneToMany(() => UserOtpEntityFixture, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntityFixture[];
  @OneToMany(() => UserRoleEntityFixture, (userRole) => userRole.assignee)
  userRoles?: RoleAssignmentSqliteEntity[];
}
