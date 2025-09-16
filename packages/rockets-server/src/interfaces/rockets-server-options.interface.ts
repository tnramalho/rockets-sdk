import { RocketsServerSettingsInterface } from './rockets-server-settings.interface';
import {
  ProfileCreatableInterface,
  ProfileModelUpdatableInterface,
} from '../modules/profile/interfaces/profile.interface';
import { AuthProviderInterface } from './auth-provider.interface';

/**
 * Generic profile configuration interface
 * This allows clients to provide their own entity and DTO classes
 * Profile functionality is always enabled when this configuration is provided
 */
export interface ProfileConfigInterface<
  TCreateDto extends ProfileCreatableInterface = ProfileCreatableInterface,
  TUpdateDto extends ProfileModelUpdatableInterface = ProfileModelUpdatableInterface,
> {
  /**
   * Profile create DTO class
   * Must extend ProfileCreatableInterface
   */
  createDto: new () => TCreateDto;
  /**
   * Profile update DTO class
   * Must extend ProfileModelUpdatableInterface
   */
  updateDto: new () => TUpdateDto;
}

/**
 * Rockets Server module options interface
 */
export interface RocketsServerOptionsInterface {
  settings: RocketsServerSettingsInterface;
  /**
   * Auth provider implementation to validate tokens
   */
  authProvider: AuthProviderInterface;
  /**
   * Profile configuration for dynamic profile service
   * Uses generic types for flexibility
   */
  profile: ProfileConfigInterface;
}
