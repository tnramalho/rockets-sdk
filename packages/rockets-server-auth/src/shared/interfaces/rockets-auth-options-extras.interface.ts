import { AuthRouterOptionsExtrasInterface } from '@concepta/nestjs-auth-router';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { RoleOptionsExtrasInterface } from '@concepta/nestjs-role/dist/interfaces/role-options-extras.interface';
import { DynamicModule, Type } from '@nestjs/common';
import { RocketsAuthUserEntityInterface } from '../../domains/user/interfaces/rockets-auth-user-entity.interface';
import { RocketsAuthUserCreatableInterface } from '../../domains/user/interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserUpdatableInterface } from '../../domains/user/interfaces/rockets-auth-user-updatable.interface';

export interface UserCrudOptionsExtrasInterface {
  imports?: DynamicModule['imports'];
  path?: string;
  model: Type;
  adapter: Type<CrudAdapter<RocketsAuthUserEntityInterface>>;
  dto?: {
    createOne?: Type<RocketsAuthUserCreatableInterface>;
    updateOne?: Type<RocketsAuthUserUpdatableInterface>;
  };
}

export interface DisableControllerOptionsInterface {
  password?: boolean; // true = disabled
  refresh?: boolean; // true = disabled
  recovery?: boolean; // true = disabled
  otp?: boolean; // true = disabled
  oAuth?: boolean; // true = disabled
  signup?: boolean; // true = disabled (admin submodule)
  admin?: boolean; // true = disabled (admin submodule)
}

export interface RocketsAuthOptionsExtrasInterface
  extends Pick<DynamicModule, 'global' | 'controllers'> {
  /**
   * Enable global auth guard
   * When true, registers AuthGuard as APP_GUARD globally
   * When false, only provides AuthGuard as a service (not global)
   * Default: true
   */
  enableGlobalGuard?: boolean;
  user?: { imports: DynamicModule['imports'] };
  otp?: { imports: DynamicModule['imports'] };
  federated?: { imports: DynamicModule['imports'] };
  role?: RoleOptionsExtrasInterface & { imports: DynamicModule['imports'] };
  authRouter?: AuthRouterOptionsExtrasInterface;
  userCrud?: UserCrudOptionsExtrasInterface;
  disableController?: DisableControllerOptionsInterface;
}
