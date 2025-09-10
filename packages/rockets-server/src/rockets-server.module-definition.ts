import { createSettingsProvider } from '@concepta/nestjs-common';
import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { RocketsServerAuthProvider, ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from './rockets-server.constants';
import { MeController } from './controllers/user.controller';

import { AuthProviderInterface } from './interfaces/auth-provider.interface';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
import { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';
import { ConfigModule } from '@nestjs/config';
import { AuthJwtModule } from '@concepta/nestjs-auth-jwt';
import { JwtModule } from '@concepta/nestjs-jwt';
import type { AuthJwtOptionsInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-options.interface';
import { RocketsServerSettingsInterface } from './interfaces/rockets-server-settings.interface';
import { rocketsServerOptionsDefaultConfig } from './config/rockets-server-options-default.config';
import { ProviderUserModelService } from './guards/provider-user-model.service';
import { ProviderVerifyTokenService } from './guards/provider-verify-token.service';

const RAW_OPTIONS_TOKEN = Symbol('__ROCKETS_SERVER_MODULE_RAW_OPTIONS_TOKEN__');

export const {
  ConfigurableModuleClass: RocketsServerModuleClass,
  OPTIONS_TYPE: ROCKETS_SERVER_MODULE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RocketsServerOptionsInterface>({
  moduleName: 'RocketsServer',
  optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
  .setExtras<RocketsServerOptionsExtrasInterface>(
    {
      global: false,
    },
    definitionTransform,
  )
  .build();

export type RocketsServerOptions = Omit<
  typeof ROCKETS_SERVER_MODULE_OPTIONS_TYPE,
  'global'
>;

export type RocketsServerAsyncOptions = Omit<
  typeof ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE,
  'global'
>;

/**
 * Transform the definition to include the combined modules
 */
function definitionTransform(
  definition: DynamicModule,
  extras: RocketsServerOptionsExtrasInterface,
): DynamicModule {
  const { imports = [], providers = [], exports = [] } = definition;
  //const { controllers } = extras;

  // Base module
  const baseModule: DynamicModule = {
    ...definition,
    global: extras.global,
    imports: createRocketsServerImports({ imports, extras }),
    controllers: createRocketsServerControllers({ extras }) || [],
    providers: [...createRocketsServerProviders({ providers, extras })],
    exports: createRocketsServerExports({ exports, extras }),
  };

  return baseModule;
}

export function createRocketsServerControllers(options: {
  controllers?: DynamicModule['controllers'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['controllers'] {
  return (() => {
    const list: DynamicModule['controllers'] = [MeController];

    return list;
  })();
}

export function createRocketsServerSettingsProvider(
  optionsOverrides?: RocketsServerOptionsInterface,
): Provider {
  return createSettingsProvider<
    RocketsServerSettingsInterface,
    RocketsServerOptionsInterface
  >({
    settingsToken: ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
    optionsToken: RAW_OPTIONS_TOKEN,
    settingsKey: rocketsServerOptionsDefaultConfig.KEY,
    optionsOverrides,
  });
}

/**
 * Create imports for the combined module
 */
export function createRocketsServerImports(options: {
  imports: DynamicModule['imports'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['imports'] {
  
  const imports: DynamicModule['imports'] = [
    ...(options.imports || []),
    ConfigModule.forFeature(rocketsServerOptionsDefaultConfig),
    JwtModule.forRoot({}),
    // This exports the AuthJWTGuard
    // that will be validated based on overrides properties
    AuthJwtModule.forRootAsync({
      inject: [
        RAW_OPTIONS_TOKEN,
        ProviderUserModelService,
        ProviderVerifyTokenService
      ],
      useFactory: (
        opts: RocketsServerOptionsInterface,
        providerUserModelService: ProviderUserModelService,
        providerVerifyTokenService: ProviderVerifyTokenService,
      ): AuthJwtOptionsInterface => {
        return {
          // get the user based on sub
          userModelService: opts.services?.userModelService || providerUserModelService,
          // verify and decode the token
          verifyTokenService: opts.services?.verifyTokenService || providerVerifyTokenService,
        };
      },
    }),
  ];

  return imports;
}

/**
 * Create exports for the combined module
 */
export function createRocketsServerExports(options: {
  exports: DynamicModule['exports'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['exports'] {
  return [
    ...(options.exports || []),
    ConfigModule,
    RAW_OPTIONS_TOKEN,
    ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
    ProviderVerifyTokenService,
    ProviderUserModelService,
  ];
}

/**
 * Create providers for the combined module
 */
export function createRocketsServerProviders(options: {
  providers?: Provider[];
  extras?: RocketsServerOptionsExtrasInterface;
}): Provider[] {
  return [
    ...(options.providers ?? []),
    createRocketsServerSettingsProvider(),
    {
      provide: RocketsServerAuthProvider,
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (opts: RocketsServerOptionsInterface): AuthProviderInterface => {
        return opts.services.authProvider;
      },
    },
    ProviderVerifyTokenService,
    ProviderUserModelService,
  ];
}
