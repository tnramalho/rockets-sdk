import { DataSourceOptions } from 'typeorm';
import { UserFixture } from './user/user.entity.fixture';
import { UserMetadataEntityFixture } from './user/user-metadata.entity.fixture';
import { UserPasswordHistoryEntityFixture } from './user/user-password-history.entity.fixture';
import { UserOtpEntityFixture } from './user/user-otp-entity.fixture';
import { FederatedEntityFixture } from './federated/federated.entity.fixture';
import { RoleEntityFixture } from './role/role.entity.fixture';
import { UserRoleEntityFixture } from './role/user-role.entity.fixture';

export const ormConfig: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [
    UserFixture,
    UserMetadataEntityFixture,
    UserPasswordHistoryEntityFixture,
    UserOtpEntityFixture,
    FederatedEntityFixture,
    RoleEntityFixture,
    UserRoleEntityFixture,
  ],
};
