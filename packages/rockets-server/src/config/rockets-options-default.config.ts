import { registerAs } from '@nestjs/config';
import { ROCKETS_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from '../rockets.constants';
import { RocketsSettingsInterface } from '../interfaces/rockets-settings.interface';

/**
 * Authentication combined configuration
 *
 * This combines all authentication-related configurations into a single namespace.
 */
export const rocketsOptionsDefaultConfig = registerAs(
  ROCKETS_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
  (): RocketsSettingsInterface => {
    return {};
  },
);
