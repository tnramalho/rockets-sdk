import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { UserMetadataEntityFixture } from './user-metadata.entity.fixture';
import { UserOtpEntityFixture } from './user-otp-entity.fixture';
import { UserRoleEntityFixture } from '../role/user-role.entity.fixture';
import { RoleAssignmentSqliteEntity } from '@concepta/nestjs-typeorm-ext';

@Entity()
export class UserFixture extends UserSqliteEntity {
  @OneToOne(
    () => UserMetadataEntityFixture,
    (userMetadata) => userMetadata.user,
  )
  userMetadata?: UserMetadataEntityFixture;
  @OneToMany(() => UserOtpEntityFixture, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntityFixture[];
  @OneToMany(() => UserRoleEntityFixture, (userRole) => userRole.assignee)
  userRoles?: RoleAssignmentSqliteEntity[];
}
