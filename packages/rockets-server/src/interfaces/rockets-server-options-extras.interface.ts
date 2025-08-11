import { DynamicModule, PlainLiteralObject, Type } from '@nestjs/common';
import { AuthRouterOptionsExtrasInterface } from '@concepta/nestjs-auth-router';
import { RocketsServerOptionsInterface } from './rockets-server-options.interface';
import { RocketsServerUserEntityInterface } from './user/rockets-server-user-entity.interface';
import { CrudAdapter } from '@concepta/nestjs-crud';

export interface AdminOptionsExtrasInterface {
  imports?: DynamicModule['imports'];
  path?: string;
  model: Type; 
  entity: Type<RocketsServerUserEntityInterface>;
  adapter: Type<CrudAdapter<RocketsServerUserEntityInterface>>;
  dto?: {
    createOne?: Type;
    createMany?: Type;
    updateOne?: Type;
    replaceOne?: Type;
  };
}


export interface RocketsServerOptionsExtrasInterface
  extends Pick<DynamicModule, 'global' | 'controllers'> {
  user?: { imports: DynamicModule['imports'] };
  otp?: { imports: DynamicModule['imports'] };
  federated?: { imports: DynamicModule['imports'] };
  role?: { imports: DynamicModule['imports'] };
  authRouter?: AuthRouterOptionsExtrasInterface;
  admin?: AdminOptionsExtrasInterface; 
}
