import { Type } from '@nestjs/common';
import { CrudAdapter } from '@concepta/nestjs-crud';
import { RocketsServerUserEntityInterface, UserProfileEntityInterface } from '@concepta/nestjs-common';
import { AdminSettingsInterface } from './admin-settings.interface';

export interface AdminOptionsInterface {
  settings?: AdminSettingsInterface;
  adapter: Type<CrudAdapter<RocketsServerUserEntityInterface>>;
  profile?: {
    adapter: Type<CrudAdapter<UserProfileEntityInterface>>;
  };
}


