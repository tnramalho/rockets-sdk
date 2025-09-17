import { createSettingsProvider } from '@concepta/nestjs-common';
import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { SwaggerUiModule } from '@concepta/nestjs-swagger-ui';
import {
  RocketsServerAuthProvider,
  ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
} from './rockets-server.constants';
import { MeController } from './modules/user/user.controller';
import { AuthProviderInterface } from './interfaces/auth-provider.interface';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
import { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';
import { ConfigModule } from '@nestjs/config';
import { RocketsServerSettingsInterface } from './interfaces/rockets-server-settings.interface';
import { rocketsServerOptionsDefaultConfig } from './config/rockets-server-options-default.config';
import { AuthGuard } from './guards/auth.guard';
import { GenericProfileModelService } from './modules/profile/services/profile.model.service';
import {
  ProfileModelService,
  PROFILE_MODULE_PROFILE_ENTITY_KEY,
} from './modules/profile/constants/profile.constants';
import {
  getDynamicRepositoryToken,
  RepositoryInterface,
} from '@concepta/nestjs-common';
import { ProfileEntityInterface } from './modules/profile/interfaces/profile.interface';

import { RAW_OPTIONS_TOKEN } from './rockets-server.tokens';

export const {
  ConfigurableModuleClass: RocketsServerModuleClass,
  OPTIONS_TYPE: ROCKETS_SERVER_MODULE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RocketsServerOptionsInterface>({
  moduleName: 'RocketsServer',
  optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
  .setExtras<RocketsServerOptionsExtrasInterface>(
    { global: false },
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
 * Follows SDK patterns for module transformation
 */
function definitionTransform(
  definition: DynamicModule,
  extras: RocketsServerOptionsExtrasInterface,
): DynamicModule {
  const { imports: defImports = [], providers = [], exports = [] } = definition;

  // Base module
  const baseModule: DynamicModule = {
    ...definition,
    global: extras.global,
    imports: [...createRocketsServerImports({ imports: defImports, extras })],
    controllers: createRocketsServerControllers({ extras }) || [],
    providers: [...createRocketsServerProviders({ providers, extras })],
    exports: createRocketsServerExports({ exports, extras }),
  };

  return baseModule;
}

/**
 * Create controllers for the combined module
 * Follows SDK patterns for controller creation
 */
export function createRocketsServerControllers(_options: {
  controllers?: DynamicModule['controllers'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['controllers'] {
  return (() => {
    const list: DynamicModule['controllers'] = [MeController];
    return list;
  })();
}

/**
 * Create settings provider
 * Follows SDK patterns for settings providers
 */
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
 * Follows SDK patterns for import creation
 */
export function createRocketsServerImports(options: {
  imports?: DynamicModule['imports'];
  extras?: RocketsServerOptionsExtrasInterface;
}): NonNullable<DynamicModule['imports']> {
  const baseImports: NonNullable<DynamicModule['imports']> = [
    ConfigModule.forFeature(rocketsServerOptionsDefaultConfig),
    SwaggerUiModule.registerAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          documentBuilder: options.swagger?.documentBuilder,
          settings: options.swagger?.settings,
        };
      },
    }),
  ];
  const extraImports = options.imports ?? [];
  return [
    ...extraImports,
    ...baseImports
  ];
}

/**
 * Create exports for the combined module
 * Follows SDK patterns for export creation
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
    ProfileModelService,
  ];
}

/**
 * Create providers for the combined module
 * Follows SDK patterns for provider creation
 */
export function createRocketsServerProviders(options: {
  providers?: Provider[];
  extras?: RocketsServerOptionsExtrasInterface;
}): Provider[] {
  const providers: Provider[] = [
    ...(options.providers ?? []),
    createRocketsServerSettingsProvider(),
    Reflector, // Add Reflector explicitly
    {
      provide: RocketsServerAuthProvider,
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (
        opts: RocketsServerOptionsInterface,
      ): AuthProviderInterface => {
        return opts.authProvider;
      },
    },
    // Profile service provider
    {
      provide: ProfileModelService,
      inject: [
        RAW_OPTIONS_TOKEN,
        getDynamicRepositoryToken(PROFILE_MODULE_PROFILE_ENTITY_KEY),
      ],
      useFactory: (
        opts: RocketsServerOptionsInterface,
        repository: RepositoryInterface<ProfileEntityInterface>,
      ) => {
        const { createDto, updateDto } = opts.profile;
        return new GenericProfileModelService(repository, createDto, updateDto);
      },
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ];

  return providers;
}
