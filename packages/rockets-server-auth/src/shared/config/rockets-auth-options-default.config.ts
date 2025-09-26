import { registerAs } from '@nestjs/config';

import { RocketsAuthSettingsInterface } from '../interfaces/rockets-auth-settings.interface';
import { ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from '../constants/rockets-auth.constants';

/**
 * Authentication combined configuration
 *
 * This combines all authentication-related configurations into a single namespace.
 */
export const rocketsAuthOptionsDefaultConfig = registerAs(
  ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
  (): RocketsAuthSettingsInterface => {
    return {
      role: {
        adminRoleName: process.env?.ADMIN_ROLE_NAME ?? 'admin',
      },
      email: {
        from: 'from',
        baseUrl: 'baseUrl',
        tokenUrlFormatter: (baseUrl: string, passcode: string) => {
          return `${baseUrl}/${passcode}`;
        },
        templates: {
          sendOtp: {
            fileName: __dirname + '/../assets/send-otp.template.hbs',
            subject: 'Your One Time Password',
          },
        },
      },
      otp: {
        assignment: 'userOtp',
        category: 'auth-login',
        type: 'uuid',
        expiresIn: '1h',
      },
    };
  },
);
