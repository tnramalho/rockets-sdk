import { DynamicModule, Type } from '@nestjs/common';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

export interface RocketsServerUserProfileOptionsExtrasInterface
  extends Pick<DynamicModule, 'global'> {
  crud?: {
    adapter: Type<CrudAdapter<UserProfileEntityInterface>>;
    path?: string;
    model?: Type;
    dto: {
      createOne: Type;
      createMany?: Type;
      updateOne: Type;
      replaceOne?: Type;
    };
  };
}


