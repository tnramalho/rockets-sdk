import { Module, DynamicModule } from '@nestjs/common';
import { RocketsServerAdminModuleClass, RocketsServerAdminAsyncOptions, RocketsServerAdminOptions } from './rockets-server-admin.module-definition';

@Module({})
export class RocketsServerAdminModule extends RocketsServerAdminModuleClass {
  static forRoot(options: RocketsServerAdminOptions): DynamicModule {
    return super.register(options);
  }

  static forRootAsync(options: RocketsServerAdminAsyncOptions): DynamicModule {
    return super.registerAsync(options);
  }
}
