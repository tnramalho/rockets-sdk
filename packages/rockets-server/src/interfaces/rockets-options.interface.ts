import { RocketsSettingsInterface } from './rockets-settings.interface';
import {
  UserMetadataCreatableInterface,
  UserMetadataModelUpdatableInterface,
} from '../modules/user-metadata/interfaces/user-metadata.interface';
import { AuthProviderInterface } from './auth-provider.interface';
import { SwaggerUiOptionsInterface } from '@concepta/nestjs-swagger-ui';

/**
 * Generic userMetadata configuration interface
 * This allows clients to provide their own entity and DTO classes
 * UserMetadata functionality is always enabled when this configuration is provided
 */
export interface UserMetadataConfigInterface<
  TCreateDto extends UserMetadataCreatableInterface = UserMetadataCreatableInterface,
  TUpdateDto extends UserMetadataModelUpdatableInterface = UserMetadataModelUpdatableInterface,
> {
  /**
   * UserMetadata create DTO class
   * Must extend UserMetadataCreatableInterface
   */
  createDto: new () => TCreateDto;
  /**
   * UserMetadata update DTO class
   * Must extend UserMetadataModelUpdatableInterface
   */
  updateDto: new () => TUpdateDto;
}

/**
 * Rockets module options interface
 */
export interface RocketsOptionsInterface {
  settings?: RocketsSettingsInterface;
  /**
   * Swagger UI configuration options
   * Used to customize the Swagger/OpenAPI documentation interface
   */
  swagger?: SwaggerUiOptionsInterface;
  /**
   * Auth provider implementation to validate tokens
   */
  authProvider: AuthProviderInterface;
  /**
   * UserMetadata configuration for dynamic userMetadata service
   * Uses generic types for flexibility
   */
  userMetadata: UserMetadataConfigInterface;
}
