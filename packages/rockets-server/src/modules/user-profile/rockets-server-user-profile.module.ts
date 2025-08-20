import { DynamicModule, Module } from '@nestjs/common';
import {
  RocketsServerUserProfileAsyncOptions,
  RocketsServerUserProfileModuleClass,
  RocketsServerUserProfileOptions,
} from './rockets-server-user-profile.module-definition';

// TODO: review the best pattern for user profile and admin crud
@Module({})
export class RocketsServerUserProfileModule extends RocketsServerUserProfileModuleClass {
  static forRoot(options: RocketsServerUserProfileOptions): DynamicModule {
    return super.register({ ...options, global: true });
  }

  static forRootAsync(
    options: RocketsServerUserProfileAsyncOptions,
  ): DynamicModule {
    return super.registerAsync({ ...options, global: true });
  }
}

