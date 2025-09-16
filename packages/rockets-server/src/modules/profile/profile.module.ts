import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  RepositoryInterface,
  getDynamicRepositoryToken,
} from '@concepta/nestjs-common';
import {
  ProfileEntityInterface,
  ProfileCreatableInterface,
  ProfileModelUpdatableInterface,
} from './interfaces/profile.interface';
import {
  PROFILE_MODULE_PROFILE_ENTITY_KEY,
  ProfileModelService,
} from './constants/profile.constants';
import { GenericProfileModelService } from './services/profile.model.service';
import { RAW_OPTIONS_TOKEN } from '../../rockets-server.tokens';
import { RocketsServerOptionsInterface } from '../../interfaces/rockets-server-options.interface';

export interface ProfileModuleOptionsInterface<
  TCreateDto extends ProfileCreatableInterface = ProfileCreatableInterface,
  TUpdateDto extends ProfileModelUpdatableInterface = ProfileModelUpdatableInterface,
> {
  createDto: new () => TCreateDto;
  updateDto: new () => TUpdateDto;
}

@Module({})
export class ProfileModule {
  static register(): DynamicModule {
    const providers: Provider[] = [
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
          return new GenericProfileModelService(
            repository,
            createDto,
            updateDto,
          );
        },
      },
    ];

    return {
      module: ProfileModule,
      providers,
      exports: [ProfileModelService],
    };
  }
}
