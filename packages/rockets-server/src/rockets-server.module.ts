import { DynamicModule, Module } from '@nestjs/common';
import { RocketsServerAsyncOptions, RocketsServerModuleClass } from './rockets-server.module-definition';


/**
 * Rockets Server module that provides core server functionality
 *
 * This module provides the base structure for server operations
 * and can be extended with specific functionality as needed.
 */
@Module({})
export class RocketsServerModule extends RocketsServerModuleClass {
  static forRootAsync(options: RocketsServerAsyncOptions): DynamicModule {
    return super.registerAsync({
      ...options,
      global: true,
    });
  }
}
