import { AuthRouterOptionsExtrasInterface } from '@concepta/nestjs-auth-router';
import { RoleOptionsExtrasInterface } from '@concepta/nestjs-role/dist/interfaces/role-options-extras.interface';
import { DynamicModule, Type } from '@nestjs/common';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';
import { AdminOptionsExtrasInterface } from '../modules/admin/admin-options-extras.interface';
import { RocketsServerUserProfileModelServiceInterface, RocketsServerUserProfileOptionsExtrasInterface } from '@user-profile';
import { Type as NestType } from '@nestjs/common';

export interface RocketsServerOptionsExtrasInterface
  extends Pick<DynamicModule, 'global' | 'controllers'> {
  user?: { imports: DynamicModule['imports'] };
  otp?: { imports: DynamicModule['imports'] };
  federated?: { imports: DynamicModule['imports'] };
  role?: RoleOptionsExtrasInterface & { imports: DynamicModule['imports'] };
  authRouter?: AuthRouterOptionsExtrasInterface;
  admin?: AdminOptionsExtrasInterface;
  userProfile?: RocketsServerUserProfileOptionsExtrasInterface;
}
