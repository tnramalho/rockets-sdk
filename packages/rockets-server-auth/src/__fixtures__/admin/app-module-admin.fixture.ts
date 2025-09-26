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
import { UserUserMetadataEntityFixture } from '../user/user-metadata.entity.fixture';
import { UserFixture } from '../user/user.entity.fixture';

import { RocketsAuthUserCreateDto } from '../../domains/user/dto/rockets-auth-user-create.dto';
import { RocketsAuthUserUpdateDto } from '../../domains/user/dto/rockets-auth-user-update.dto';
import { RocketsAuthUserDto } from '../../domains/user/dto/rockets-auth-user.dto';
import { AdminUserTypeOrmCrudAdapter } from './admin-user-crud.adapter';

@Global()
@Module({
  imports: [
    // TypeORM datasource
    TypeOrmModule.forRoot({
      ...ormConfig,
      entities: [
        UserFixture,
        UserUserMetadataEntityFixture,
        UserPasswordHistoryEntityFixture,
        UserOtpEntityFixture,
        FederatedEntityFixture,
        RoleEntityFixture,
        UserRoleEntityFixture,
      ],
    }),
    // Dynamic repos for feature modules
    TypeOrmExtModule.forRootAsync({
      inject: [],
      useFactory: () => {
        return {
          ...ormConfig,
          entities: [
            UserFixture,
            UserOtpEntityFixture,
            UserPasswordHistoryEntityFixture,
            UserUserMetadataEntityFixture,
            FederatedEntityFixture,
            UserRoleEntityFixture,
            RoleEntityFixture,
          ],
        };
      },
    }),
    TypeOrmExtModule.forFeature({
      user: { entity: UserFixture },
      role: { entity: RoleEntityFixture },
      userRole: { entity: UserRoleEntityFixture },
      userOtp: { entity: UserOtpEntityFixture },
      federated: { entity: FederatedEntityFixture },
    }),
    TypeOrmModule.forFeature([UserFixture]),
    RocketsAuthModule.forRootAsync({
      userCrud: {
        imports: [TypeOrmModule.forFeature([UserFixture])],
        adapter: AdminUserTypeOrmCrudAdapter,
        model: RocketsAuthUserDto,
        dto: {
          createOne: RocketsAuthUserCreateDto,
          updateOne: RocketsAuthUserUpdateDto,
        },
      },
      inject: [],
      useFactory: () => ({
        // authJwt: {
        //   appGuard: true
        // },
        jwt: {
          settings: {
            access: { secret: 'test-secret' },
            refresh: { secret: 'test-secret' },
            default: { secret: 'test-secret' },
          },
        },
        services: {
          mailerService: { sendMail: () => Promise.resolve() },
        },
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class AppModuleAdminFixture {}
