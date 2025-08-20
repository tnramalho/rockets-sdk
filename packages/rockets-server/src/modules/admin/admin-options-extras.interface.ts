import { DynamicModule, Type } from '@nestjs/common';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

export interface AdminOptionsExtrasInterface {
  imports?: DynamicModule['imports'];
  path?: string;
  model?: Type;
  adapter: Type<CrudAdapter<RocketsServerUserEntityInterface>>;
  dto?: {
    createOne?: Type;
    createMany?: Type;
    updateOne?: Type;
    replaceOne?: Type;
  };
  profile?: {
    adapter: Type<CrudAdapter<UserProfileEntityInterface>>;
    dto?: {
      createOne?: Type;
      createMany?: Type;
      updateOne?: Type;
      replaceOne?: Type;
    };
  };
}


