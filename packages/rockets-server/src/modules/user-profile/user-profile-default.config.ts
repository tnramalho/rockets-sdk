import { registerAs } from '@nestjs/config';


import { ROCKETS_SERVER_USER_PROFILE_MODULE_SETTINGS_TOKEN } from '../../rockets-server.constants';
import { RocketsServerUserProfileSettingsInterface } from './interfaces/rockets-server-user-profile-settings.interface';

/**
 * Default configuration for User module.
 */
export const userProfileDefaultConfig = registerAs(
  ROCKETS_SERVER_USER_PROFILE_MODULE_SETTINGS_TOKEN,
  (): RocketsServerUserProfileSettingsInterface => {
    return {};
  },
);
