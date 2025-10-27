import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';

import { RocketsAuthModule } from '../../rockets-auth.module';
import { FederatedEntityFixture } from '../federated/federated.entity.fixture';
import { ormConfig } from '../ormconfig.fixture';
import { RoleEntityFixture } from '../role/role.entity.fixture';
import { UserRoleEntityFixture } from '../role/user-role.entity.fixture';
import { UserOtpEntityFixture } from '../user/user-otp-entity.fixture';
import { UserPasswordHistoryEntityFixture } from '../user/user-password-history.entity.fixture';
import { UserMetadataEntityFixture } from '../user/user-metadata.entity.fixture';
import { UserFixture } from '../user/user.entity.fixture';

import { RocketsAuthUserCreateDto } from '../../domains/user/dto/rockets-auth-user-create.dto';
import { RocketsAuthUserUpdateDto } from '../../domains/user/dto/rockets-auth-user-update.dto';
import { AdminUserTypeOrmCrudAdapter } from './admin-user-crud.adapter';
import { RocketsAuthRoleDto } from '../../domains/role/dto/rockets-auth-role.dto';
import { RocketsAuthRoleUpdateDto } from '../../domains/role/dto/rockets-auth-role-update.dto';
import { RoleTypeOrmCrudAdapter } from '../role/role-typeorm-crud.adapter';
import { RocketsAuthRoleCreateDto } from '../../domains/role';
import { UserMetadataTypeOrmCrudAdapterFixture as UserMetadataAdapter } from '../services/user-metadata-typeorm-crud.adapter.fixture';
import { RocketsAuthUserMetadataFixtureDto } from '../user/dto/rockets-auth-user-metadata.dto.fixture';
import { RocketsAuthUserFixtureDto } from '../user/dto/rockets-auth-user.dto.fixture';
import { ACServiceFixture } from './access-control.service.fixture';
import { acRulesFixture } from './app.acl.fixture';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig,
      entities: [
        UserFixture,
        UserMetadataEntityFixture,
        UserPasswordHistoryEntityFixture,
        UserOtpEntityFixture,
        FederatedEntityFixture,
        RoleEntityFixture,
        UserRoleEntityFixture,
      ],
    }),
    TypeOrmExtModule.forRootAsync({
      inject: [],
      useFactory: () => ({
        ...ormConfig,
        entities: [
          UserFixture,
          UserOtpEntityFixture,
          UserPasswordHistoryEntityFixture,
          UserMetadataEntityFixture,
          FederatedEntityFixture,
          UserRoleEntityFixture,
          RoleEntityFixture,
        ],
      }),
    }),
    TypeOrmExtModule.forFeature({
      user: { entity: UserFixture },
      role: { entity: RoleEntityFixture },
      userRole: { entity: UserRoleEntityFixture },
      userOtp: { entity: UserOtpEntityFixture },
      federated: { entity: FederatedEntityFixture },
    }),
    TypeOrmModule.forFeature([
      UserFixture,
      RoleEntityFixture,
      UserMetadataEntityFixture,
    ]),
    RocketsAuthModule.forRootAsync({
      userCrud: {
        imports: [
          TypeOrmModule.forFeature([UserFixture, UserMetadataEntityFixture]),
        ],
        adapter: AdminUserTypeOrmCrudAdapter,
        model: RocketsAuthUserFixtureDto,
        dto: {
          createOne: RocketsAuthUserCreateDto,
          updateOne: RocketsAuthUserUpdateDto,
        },
        userMetadataConfig: {
          adapter: UserMetadataAdapter,
          entity: UserMetadataEntityFixture,
          createDto: RocketsAuthUserMetadataFixtureDto,
          updateDto: RocketsAuthUserMetadataFixtureDto,
        },
      },
      roleCrud: {
        imports: [TypeOrmModule.forFeature([RoleEntityFixture])],
        adapter: RoleTypeOrmCrudAdapter,
        model: RocketsAuthRoleDto,
        dto: {
          createOne: RocketsAuthRoleCreateDto,
          updateOne: RocketsAuthRoleUpdateDto,
        },
      },
      enableGlobalJWTGuard: true,
      inject: [],
      useFactory: () => ({
        jwt: {
          settings: {
            access: { secret: 'test-secret' },
            refresh: { secret: 'test-secret' },
            default: { secret: 'test-secret' },
          },
        },
        services: { mailerService: { sendMail: () => Promise.resolve() } },
        accessControl: {
          service: new ACServiceFixture(),
          settings: {
            rules: acRulesFixture,
          },
        },
      }),
    }),
  ],
  providers: [ACServiceFixture],
  exports: [ACServiceFixture],
})
export class AppModuleAdminRelationsFixture {}
