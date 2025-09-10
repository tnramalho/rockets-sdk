import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { RoleAssignmentSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntityFixture } from '../user/user.entity.fixture';
import { RoleEntityFixture } from './role.entity.fixture';

@Entity('user_role')
export class UserRoleEntityFixture extends RoleAssignmentSqliteEntity {
  @ManyToOne(() => UserEntityFixture)
  assignee!: ReferenceIdInterface;

  @ManyToOne(() => RoleEntityFixture)
  role!: ReferenceIdInterface;
}