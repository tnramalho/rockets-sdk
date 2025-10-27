import { DynamicModule, Module } from '@nestjs/common';
import {
  RocketsAsyncOptions,
  RocketsModuleClass,
  RocketsOptions,
} from './rockets.module-definition';

/**
 * Rockets module that provides core server functionality
 *
 * This module provides the base structure for server operations
 * and can be extended with specific functionality as needed.
 */
@Module({})
export class RocketsModule extends RocketsModuleClass {
  static forRoot(options: RocketsOptions): DynamicModule {
    return super.register({ ...options, global: true });
  }
  static forRootAsync(options: RocketsAsyncOptions): DynamicModule {
    return super.registerAsync({
      ...options,
      global: true,
    });
  }
}
