// Export configuration types
export type {
  RocketsServerOptionsInterface,
  ProfileConfigInterface,
} from './interfaces/rockets-server-options.interface';
export type { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';

// Export auth components
export { AuthGuard } from './guards/auth.guard';
export { AuthProviderInterface } from './interfaces/auth-provider.interface';
export { AuthorizedUser } from './interfaces/auth-user.interface';

// Export user components
export { UserUpdateDto, UserResponseDto } from './modules/user/user.dto';
export {
  BaseUserEntityInterface,
  UserEntityInterface,
  UserCreatableInterface,
  UserUpdatableInterface,
  UserModelUpdatableInterface,
  BaseUserDto,
  BaseUserCreateDto,
  BaseUserUpdateDto,
} from './modules/user/interfaces/user.interface';
export { UserModule } from './modules/user/user.module';

// Export profile components (for advanced usage)
export {
  BaseProfileEntityInterface,
  ProfileEntityInterface,
  ProfileCreatableInterface,
  ProfileUpdatableInterface,
  ProfileModelUpdatableInterface,
  ProfileModelServiceInterface,
  BaseProfileDto,
  BaseProfileCreateDto,
  BaseProfileUpdateDto,
} from './modules/profile/interfaces/profile.interface';
export {
  ProfileModelService,
  PROFILE_MODULE_PROFILE_ENTITY_KEY,
} from './modules/profile/constants/profile.constants';

// Export main module
export { RocketsServerModule } from './rockets-server.module';
