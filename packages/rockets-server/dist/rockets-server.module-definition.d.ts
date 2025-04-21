import { DynamicModule, Provider } from '@nestjs/common';
import { RocketsServerEntitiesOptionsInterface } from './interfaces/rockets-server-entities-options.interface';
import { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
export declare const RocketsServerModuleClass: import("@nestjs/common").ConfigurableModuleCls<RocketsServerOptionsInterface, "register", "create", RocketsServerOptionsExtrasInterface>, ROCKETS_SERVER_MODULE_OPTIONS_TYPE: RocketsServerOptionsInterface & Partial<RocketsServerOptionsExtrasInterface>, ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE: import("@nestjs/common").ConfigurableModuleAsyncOptions<RocketsServerOptionsInterface, "create"> & Partial<RocketsServerOptionsExtrasInterface>;
export type RocketsServerOptions = Omit<typeof ROCKETS_SERVER_MODULE_OPTIONS_TYPE, 'global'>;
export type RocketsServerAsyncOptions = Omit<typeof ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE, 'global'>;
export declare function createRocketsServerControllers(options: {
    controllers?: DynamicModule['controllers'];
}): DynamicModule['controllers'];
export declare function createRocketsServerSettingsProvider(optionsOverrides?: RocketsServerOptionsInterface): Provider;
export declare function createRocketsServerImports(options: {
    imports: DynamicModule['imports'];
    entities: RocketsServerEntitiesOptionsInterface['entities'];
}): DynamicModule['imports'];
export declare function createRocketsServerExports(options: {
    exports: DynamicModule['exports'];
}): DynamicModule['exports'];
export declare function createRocketsServerProviders(options: {
    overrides?: RocketsServerOptions;
    providers?: Provider[];
}): Provider[];
//# sourceMappingURL=rockets-server.module-definition.d.ts.map