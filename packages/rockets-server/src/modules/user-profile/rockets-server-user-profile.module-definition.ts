import { ConfigurableModuleBuilder, DynamicModule, Injectable, Provider, Type } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createSettingsProvider, getDynamicRepositoryToken, InjectDynamicRepository, RepositoryInterface, UserProfileCreatableInterface, UserProfileEntityInterface } from '@concepta/nestjs-common';
import { UserProfileModelService } from './rockets-server-user-profile-model.service';
import type { RocketsServerUserProfileSettingsInterface } from './interfaces/rockets-server-user-profile-settings.interface';
import type { RocketsServerUserProfileOptionsInterface } from './interfaces/rockets-server-user-profile-options.interface';
import type { RocketsServerUserProfileOptionsExtrasInterface } from './interfaces/rockets-server-user-profile-options-extras.interface';
import { ROCKETS_SERVER_USER_PROFILE_MODULE_SETTINGS_TOKEN, ROCKETS_SERVER_USER_PROFILE_REPOSITORY_KEY, UserProfileCrudService } from '../../rockets-server.constants';
import { userProfileDefaultConfig } from './user-profile-default.config';
import { RocketsServerUserProfileModelServiceInterface } from './interfaces/rockets-server-user-profile-model-service.interface';
import { RocketsServerUserProfileModelService } from '../../rockets-server.constants';
import { IsString } from 'class-validator';
import { ConfigurableCrudBuilder } from '@concepta/nestjs-crud';

const RAW_OPTIONS_TOKEN = Symbol(
  '__ROCKETS_SERVER_USER_PROFILE_MODULE_RAW_OPTIONS_TOKEN__',
);

export const {
  ConfigurableModuleClass: RocketsServerUserProfileModuleClass,
  OPTIONS_TYPE: ROCKETS_SERVER_USER_PROFILE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ROCKETS_SERVER_USER_PROFILE_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RocketsServerUserProfileOptionsInterface>({
  moduleName: 'RocketsServerUserProfile',
  optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
  .setExtras<RocketsServerUserProfileOptionsExtrasInterface>({ global: false },
    definitionTransform
  )
  .build();

export type RocketsServerUserProfileOptions = Omit<
  typeof ROCKETS_SERVER_USER_PROFILE_OPTIONS_TYPE,
  'global'
>;

export type RocketsServerUserProfileAsyncOptions = Omit<
  typeof ROCKETS_SERVER_USER_PROFILE_ASYNC_OPTIONS_TYPE,
  'global'
>;

function definitionTransform(
  definition: DynamicModule,
  extras: RocketsServerUserProfileOptionsExtrasInterface,
): DynamicModule {
  const { imports = [], providers = [], exports = [], controllers = [] } = definition;

  const { providers: crudProviders, controllers: crudControllers } =
    createRocketsServerUserProfileCrud(extras);

  return {
    ...definition,
    global: extras.global,
    imports,
    providers: [
      ...createRocketsServerUserProfileProviders({ providers }),
      ...crudProviders,
    ],
    controllers: [...controllers, ...crudControllers],
    exports: createRocketsServerUserProfileExports({ exports }),
  };
}

function createRocketsServerUserProfileCrud(
  extras: RocketsServerUserProfileOptionsExtrasInterface,
): { providers: Provider[]; controllers: NonNullable<DynamicModule['controllers']> } {
  if (!extras?.crud?.adapter) {
    return { providers: [], controllers: [] };
  }

  const builder = new ConfigurableCrudBuilder({
    service: {
      adapter: extras.crud.adapter,
      injectionToken: UserProfileCrudService,
    },
    controller: {
      path: extras.crud.path || 'admin/user-profiles',
      model: { type: extras.crud.model || class {} },
      extraDecorators: [ApiTags('admin'), ApiBearerAuth()],
    },
    getMany: {},
    getOne: {},
    createOne: { dto: extras.crud.dto?.createOne || ProfileCreateDto },
    createMany: { dto: extras.crud.dto?.createMany || ProfileCreateDto },
    updateOne: { dto: extras.crud.dto?.updateOne || ProfileUpdateDto },
    replaceOne: { dto: extras.crud.dto?.replaceOne || ProfileCreateDto },
    deleteOne: {},
  });

  const { ConfigurableControllerClass, ConfigurableServiceClass } = builder.build();

  const crudProviders: Provider[] = [
    extras.crud.adapter,
    { provide: UserProfileCrudService, useClass: ConfigurableServiceClass },
  ];
  
  class UserProfileCrudControllerClass extends ConfigurableControllerClass { }
  const crudControllers: DynamicModule['controllers'] = [
    UserProfileCrudControllerClass,
  ];

  return { providers: crudProviders, controllers: crudControllers };
}

export function createRocketsServerUserProfileSettingsProvider(
  optionsOverrides?: RocketsServerUserProfileOptionsInterface,
): Provider {
  return createSettingsProvider<
    RocketsServerUserProfileSettingsInterface,
    RocketsServerUserProfileOptionsInterface
  >({
    settingsToken: ROCKETS_SERVER_USER_PROFILE_MODULE_SETTINGS_TOKEN,
    optionsToken: RAW_OPTIONS_TOKEN,
    settingsKey: userProfileDefaultConfig.KEY,
    optionsOverrides,
  });
}

export function createRocketsServerUserProfileProviders(options: {
  providers?: Provider[];
}): Provider[] {
  const providers: Provider[] = [
    ...(options.providers ?? []),
    //createRocketsServerUserProfileSettingsProvider(),
    createUserProfileModelServiceProvider(),
  ];

  return providers;
}

class ProfileCreateDto implements UserProfileCreatableInterface {
  @IsString()
  userId: string;
  @IsString()
  firstName: string;
}
class ProfileUpdateDto implements UserProfileCreatableInterface {
  id: string;
  userId: string;
  firstName: string;
}

export function createUserProfileModelServiceProvider(options: {
  extras: RocketsServerUserProfileOptionsExtrasInterface,
}): Provider {
  @Injectable()
  class RSUserProfileModelService
    extends UserProfileModelService implements RocketsServerUserProfileModelServiceInterface {
    
    protected createDto = options.extras.crud?.dto.createOne;
    protected updateDto = options.extras.crud?.dto.updateOne;
    constructor(
      @InjectDynamicRepository(ROCKETS_SERVER_USER_PROFILE_REPOSITORY_KEY)
      repo: RepositoryInterface<UserProfileEntityInterface>,
    ) {
      super(repo);
    }
  }

  return {
    provide: RocketsServerUserProfileModelService,
    inject: [
      RAW_OPTIONS_TOKEN,
      getDynamicRepositoryToken(ROCKETS_SERVER_USER_PROFILE_REPOSITORY_KEY),
    ],
    useFactory: async (
      options: RocketsServerUserProfileOptionsInterface,
      userRepo: RepositoryInterface<UserProfileEntityInterface>,
    ) => {
      return options.userProfileModelService ??
        new RSUserProfileModelService(userRepo);
  }};
}

// no direct CRUD provider here; CRUD controller/service are registered via RocketsServerUserProfileCrudModule

export function createRocketsServerUserProfileExports(options: {
  exports?: DynamicModule['exports'];
}): DynamicModule['exports'] {
  return [
    ...(options.exports || []),
    RocketsServerUserProfileModelService,
  ];
}


