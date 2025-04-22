import { DynamicModule, Provider } from '@nestjs/common';
import { RocketsAuthenticationOptionsExtrasInterface } from './interfaces/rockets-authentication-options-extras.interface';
import { RocketsAuthenticationOptionsInterface } from './interfaces/rockets-authentication-options.interface';
import { UserEntitiesOptionsInterface } from '@concepta/nestjs-user/dist/interfaces/user-entities-options.interface';
export declare const AuthenticationModuleClass: import("@nestjs/common").ConfigurableModuleCls<RocketsAuthenticationOptionsInterface, "register", "create", RocketsAuthenticationOptionsExtrasInterface>, ROCKETS_AUTHENTICATION_MODULE_OPTIONS_TYPE: RocketsAuthenticationOptionsInterface & Partial<RocketsAuthenticationOptionsExtrasInterface>, ROCKETS_AUTHENTICATION_MODULE_ASYNC_OPTIONS_TYPE: import("@nestjs/common").ConfigurableModuleAsyncOptions<RocketsAuthenticationOptionsInterface, "create"> & Partial<RocketsAuthenticationOptionsExtrasInterface>;
export type AuthenticationCombinedOptions = Omit<typeof ROCKETS_AUTHENTICATION_MODULE_OPTIONS_TYPE, 'global'>;
export type AuthenticationCombinedAsyncOptions = Omit<typeof ROCKETS_AUTHENTICATION_MODULE_ASYNC_OPTIONS_TYPE, 'global'>;
export declare function createAuthenticationOptionsControllers(options: {
    controllers?: DynamicModule['controllers'];
}): DynamicModule['controllers'];
export declare function createAuthenticationOptionsImports(options: {
    imports: DynamicModule['imports'];
    entities?: UserEntitiesOptionsInterface['entities'];
}): DynamicModule['imports'];
export declare function createAuthenticationOptionsExports(options: {
    exports: DynamicModule['exports'];
}): DynamicModule['exports'];
export declare function createAuthenticationOptionsProviders(options: {
    providers?: Provider[];
}): Provider[];
//# sourceMappingURL=rockets-authentication.module-definition.d.ts.map