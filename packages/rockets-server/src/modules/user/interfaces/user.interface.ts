/**
 * Base user entity interface
 * This is the minimal interface that all user entities must implement
 * Clients can extend this with their own fields
 */
export interface BaseUserEntityInterface {
  id: string;
  sub: string;
  email?: string;
  roles?: string[];
  claims?: Record<string, unknown>;
}

/**
 * Generic user entity interface
 * This is a generic interface that can be extended by clients
 */
export interface UserEntityInterface extends BaseUserEntityInterface {
  profile?: Record<string, unknown>;
}

/**
 * Generic user creatable interface
 * Used for creating new users with custom data
 */
export interface UserCreatableInterface {
  sub: string;
  email?: string;
  roles?: string[];
  claims?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Generic user updatable interface (for API)
 * Used for updating existing users with custom data
 */
export interface UserUpdatableInterface {
  profile?: Record<string, unknown>;
}

/**
 * Generic user model updatable interface (for model service)
 * Includes ID for model service operations
 */
export interface UserModelUpdatableInterface extends UserUpdatableInterface {
  id: string;
}

/**
 * Generic DTO class for user operations
 * This can be extended by clients with their own validation rules
 */
export class BaseUserDto {
  id?: string;
  sub?: string;
  email?: string;
  roles?: string[];
  claims?: Record<string, unknown>;
}

/**
 * Generic create DTO class
 * This can be extended by clients with their own validation rules
 */
export class BaseUserCreateDto extends BaseUserDto {
  sub!: string;
}

/**
 * Generic update DTO class
 * This can be extended by clients with their own validation rules
 */
export class BaseUserUpdateDto extends BaseUserDto {
  profile?: Record<string, unknown>;
}
