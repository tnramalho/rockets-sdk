import { InternalServerErrorException, Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';

import {
  JwtConfigUndefinedException,
  JwtFallbackConfigUndefinedException,
} from '@concepta/nestjs-jwt';
import { JwtSettingsInterface } from '@concepta/nestjs-jwt/dist/interfaces/jwt-settings.interface';
import { RocketsServerSettingsInterface } from '../interfaces/rockets-server-settings.interface';
import { ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from '../rockets-server.constants';
import { formatTokenUrl } from '../rockets-server.utils';

/**
 * Authentication combined configuration
 *
 * This combines all authentication-related configurations into a single namespace.
 */
export const authenticationOptionsDefaultConfig = registerAs(
  ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
  (): RocketsServerSettingsInterface => {
    // JWT configuration
    const jwt: JwtSettingsInterface = {
      default: {
        signOptions: {
          expiresIn: process.env?.JWT_MODULE_DEFAULT_EXPIRES_IN ?? '1h',
        },
      },
      access: {
        signOptions: {
          expiresIn:
            process.env?.JWT_MODULE_ACCESS_EXPIRES_IN ??
            process.env?.JWT_MODULE_DEFAULT_EXPIRES_IN ??
            '1h',
        },
      },
      refresh: {
        signOptions: {
          expiresIn: process.env?.JWT_MODULE_REFRESH_EXPIRES_IN ?? '99y',
        },
      },
    };

    // Configure JWT secrets
    configureAccessSecret(jwt.access);
    configureRefreshSecret(jwt.refresh, jwt.access);

    return {
      email: {
        from: 'from',
        baseUrl: 'baseUrl',
        tokenUrlFormatter: formatTokenUrl,
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

/**
 * @internal
 */
function configureAccessSecret(options: JwtSettingsInterface['access']) {
  if (!options) {
    throw new JwtConfigUndefinedException();
  }
  // was an access secret provided?
  if (process.env?.JWT_MODULE_ACCESS_SECRET) {
    // yes, use it
    options.secret = process.env.JWT_MODULE_ACCESS_SECRET;
  } else if (process.env?.NODE_ENV === 'production') {
    // we are in production, this is now allowed
    throw new InternalServerErrorException(
      'A secret key must be set when NODE_ENV=production',
    );
  } else {
    // wae are not in production, log a warning
    Logger.warn(
      'No default access token secret was provided to the JWT module.' +
        ' Since NODE_ENV is not production, a random string will be generated.' +
        ' It will not persist past this instance of the module.',
    );
    // generate one for this module instance only
    options.secret = randomUUID();
  }
}

/**
 * @internal
 */
function configureRefreshSecret(
  options: JwtSettingsInterface['refresh'],
  fallbackOptions: JwtSettingsInterface['access'],
) {
  if (!options) {
    throw new JwtConfigUndefinedException();
  }
  if (!fallbackOptions) {
    throw new JwtFallbackConfigUndefinedException();
  }
  // was a refresh secret provided?
  if (process.env?.JWT_MODULE_REFRESH_SECRET) {
    // yes, use it
    options.secret = process.env.JWT_MODULE_REFRESH_SECRET;
  } else {
    // log a warning
    Logger.log(
      'No default refresh token secret was provided to the JWT module.' +
        ' Copying the secret from the access token configuration.',
    );
    // use the same one as the access
    options.secret = fallbackOptions['secret'];
  }
}
