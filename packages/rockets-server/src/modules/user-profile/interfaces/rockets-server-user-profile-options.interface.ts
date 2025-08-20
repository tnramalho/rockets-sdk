import { RocketsServerUserProfileSettingsInterface } from './rockets-server-user-profile-settings.interface';
import { RocketsServerUserProfileModelServiceInterface } from './rockets-server-user-profile-model-service.interface';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { Type } from '@nestjs/common';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

export interface RocketsServerUserProfileOptionsInterface {
  settings?: RocketsServerUserProfileSettingsInterface;
  userProfileModelService?: RocketsServerUserProfileModelServiceInterface;
}


