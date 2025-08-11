import { PlainLiteralObject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigurableCrudBuilder, ConfigurableCrudOptions } from '@concepta/nestjs-crud';
import { DeepPartial } from '@concepta/nestjs-common';
import { RocketsServerUserEntityInterface } from '../interfaces/user/rockets-server-user-entity.interface';
import { RocketsServerUserCreateDto } from '../dto/user/rockets-server-user-create.dto';
import { RocketsServerUserUpdateDto } from '../dto/user/rockets-server-user-update.dto';
import { RocketsServerUserDto } from '../dto/user/rockets-server-user.dto';
import { ADMIN_USER_CRUD_SERVICE_TOKEN } from '../rockets-server.constants';
import { AdminUserTypeOrmCrudAdapter } from '../controllers/admin/admin-user-crud.adapter';
import { TokenCrudAdapter } from '../controllers/admin/token-crud.adapter';

/**
 * Admin User CRUD Builder
 * 
 * A generic CRUD builder for admin user operations that can be configured
 * with custom entities, DTOs, and adapters at runtime.
 */
export class AdminUserCrudBuilder<
  Entity extends RocketsServerUserEntityInterface = RocketsServerUserEntityInterface,
  Creatable extends DeepPartial<Entity> = DeepPartial<Entity>,
  Updatable extends DeepPartial<Entity> = DeepPartial<Entity>,
  Replaceable extends Creatable = Creatable,
  ExtraOptions extends PlainLiteralObject = PlainLiteralObject
> extends ConfigurableCrudBuilder<Entity, Creatable, Updatable, Replaceable, ExtraOptions> {
  constructor(options: ConfigurableCrudOptions<Entity> = {
    service: {
      adapter: TokenCrudAdapter,
      injectionToken: ADMIN_USER_CRUD_SERVICE_TOKEN,
    },
    controller: {
      path: 'admin/users',
      model: {
        type: RocketsServerUserDto,
      },
      extraDecorators: [ApiTags('admin-users')],
    },
    getMany: {},
    getOne: {},
    createOne: {
      dto: RocketsServerUserCreateDto,
    },
    createMany: {
      dto: RocketsServerUserCreateDto,
    },
    updateOne: {
      dto: RocketsServerUserUpdateDto,
    },
    replaceOne: {
      dto: RocketsServerUserCreateDto,
    },
    deleteOne: {},
  }) {
    super(options);
  }
} 