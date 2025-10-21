import { DynamicModule, Module } from '@nestjs/common';

import {
  RocketsAuthAsyncOptions,
  RocketsAuthOptions,
  RocketsAuthModuleClass,
} from './rockets-auth.module-definition';

/**
 * Combined authentication module that provides all authentication options features
 *
 * This module combines the options for the following modules:
 * - JwtModule: For JWT token handling
 * - AuthenticationModule: For core authentication services
 * - AuthJwtModule: For JWT-based authentication (optional)
 * - AuthRefreshModule: For refresh token handling (optional)
 */

@Module({})
export class RocketsAuthModule extends RocketsAuthModuleClass {
  static forRoot(options: RocketsAuthOptions): DynamicModule {
    return super.register({ ...options, global: true });
  }

  static forRootAsync(options: RocketsAuthAsyncOptions): DynamicModule {
    return super.registerAsync({
      ...options,
      global: true,
    });
  }
}
