import { AuthGuardRouterOptionsExtrasInterface } from '@concepta/nestjs-auth-guard-router';
import { DynamicModule } from '@nestjs/common';

export interface RocketsServerOptionsExtrasInterface
  extends Pick<DynamicModule, 'global' | 'controllers'> {
  user?: { imports: DynamicModule['imports'] };
  otp?: { imports: DynamicModule['imports'] };
  federated?: { imports: DynamicModule['imports'] };
  authGuardRouter?: AuthGuardRouterOptionsExtrasInterface;
}
