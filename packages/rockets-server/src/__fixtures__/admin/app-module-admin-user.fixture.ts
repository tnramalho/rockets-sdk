import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import {
  ConfigurableCrudOptions,
  ConfigurableCrudOptionsTransformer,
  CrudModule,
} from '@concepta/nestjs-crud';
import { EventModule } from '@concepta/nestjs-event';

import { AdminUserCrudBuilder } from '../../utils/admin-user.crud-builder';

import { RocketsServerUserCreateDto } from '../../dto/user/rockets-server-user-create.dto';
import { RocketsServerUserUpdateDto } from '../../dto/user/rockets-server-user-update.dto';
import { RocketsServerUserDto } from '../../dto/user/rockets-server-user.dto';
import { ormConfig } from '../ormconfig.fixture';
import { UserFixture } from '../user/user.entity.fixture';
import { AdminUserTypeOrmCrudAdapter } from '../../controllers/admin/admin-user-crud.adapter';
import { Repository } from 'typeorm';

type AdminUserExtras = {
  model: {
    type: typeof RocketsServerUserDto;
  };
  createOne: {
    dto: typeof RocketsServerUserCreateDto;
  };
  updateOne: {
    dto: typeof RocketsServerUserUpdateDto;
  };
};

const extras: AdminUserExtras = {
  model: {
    type: RocketsServerUserDto,
  },
  createOne: {
    dto: RocketsServerUserCreateDto,
  },
  updateOne: {
    dto: RocketsServerUserUpdateDto,
  },
};

// Update config to use new dto
const myOptionsTransform: ConfigurableCrudOptionsTransformer<
  UserFixture,
  AdminUserExtras
> = (
  options: ConfigurableCrudOptions<UserFixture>,
  extras?: AdminUserExtras,
): ConfigurableCrudOptions<UserFixture> => {
  if (!extras) return options;

  options.controller.model.type = extras.model.type;
  options.service.adapter = AdminUserTypeOrmCrudAdapter;
  if (options.createOne) options.createOne.dto = extras.createOne.dto;
  if (options.updateOne) options.updateOne.dto = extras.updateOne.dto;
  return options;
};

// Define admin user with custom dtos
const adminUserCrudBuilder = new AdminUserCrudBuilder<
  UserFixture,
  RocketsServerUserCreateDto,
  RocketsServerUserUpdateDto,
  RocketsServerUserCreateDto,
  AdminUserExtras
>();
adminUserCrudBuilder.setExtras(extras, myOptionsTransform);

const { ConfigurableControllerClass, ConfigurableServiceProvider } =
  adminUserCrudBuilder.build();

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([UserFixture]),
    CrudModule.forRoot({}),
    EventModule.forRoot({}),
  ],
  providers: [
    AdminUserTypeOrmCrudAdapter,
    ConfigurableServiceProvider,
    {
      provide: 'ADMIN_USER_REPOSITORY_TOKEN',
      useFactory: (userRepository: Repository<UserFixture>) => userRepository,
      inject: [getRepositoryToken(UserFixture)],
    },
  ],
  exports: [ConfigurableServiceProvider],
  controllers: [ConfigurableControllerClass],
})
export class AppModuleAdminUserFixture {} 