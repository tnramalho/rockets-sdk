import { RocketsServerSettingsInterface } from './rockets-server-settings.interface';
import type { AuthProviderInterface } from './auth-provider.interface';
import type { AuthJwtOptionsInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-options.interface';
import type { AuthJwtUserModelServiceInterface } from '@concepta/nestjs-auth-jwt';
import type { VerifyTokenServiceInterface } from '@concepta/nestjs-authentication';

/**
 * Rockets Server module options interface
 */
export interface RocketsServerOptionsInterface { 
  settings: RocketsServerSettingsInterface;
  /**
   * Optional services/providers override
   */
  services: {
    /**
     * Auth provider implementation to validate tokens and resolve subjects
     */
    authProvider: AuthProviderInterface;
    /**
     * Override AuthJWT validate token service (advanced).
     */
    verifyTokenService?: VerifyTokenServiceInterface;
    /**
     * Override AuthJWT user model service (advanced).
     */
    userModelService?: AuthJwtUserModelServiceInterface;
  };
  /**
   * Options to pass into AuthJWT
   */
  authJwt?: Partial<AuthJwtOptionsInterface>;
}
