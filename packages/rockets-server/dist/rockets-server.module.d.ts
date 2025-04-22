import { DynamicModule } from '@nestjs/common';
import { RocketsServerAsyncOptions, RocketsServerOptions, RocketsServerModuleClass } from './rockets-server.module-definition';
export declare class RocketsServerModule extends RocketsServerModuleClass {
    static forRoot(options: RocketsServerOptions): DynamicModule;
    static forRootAsync(options: RocketsServerAsyncOptions): DynamicModule;
}
//# sourceMappingURL=rockets-server.module.d.ts.map