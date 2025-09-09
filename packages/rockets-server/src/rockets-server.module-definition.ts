import { createSettingsProvider } from '@concepta/nestjs-common';
import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from './rockets-server.constants';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
import { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';
import { ConfigModule } from '@nestjs/config';
import { RocketsServerSettingsInterface } from './interfaces/rockets-server-settings.interface';
import { rocketsServerOptionsDefaultConfig } from './config/rockets-server-options-default.config';

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
    const list: DynamicModule['controllers'] = [];

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
    
  ];
}
