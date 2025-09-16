// Audit field type aliases for consistency
export type AuditDateCreated = Date;
export type AuditDateUpdated = Date;
export type AuditDateDeleted = Date | null;
export type AuditVersion = number;

/**
 * Base profile entity interface
 * This is the minimal interface that all profile entities must implement
 * Clients can extend this with their own fields
 */
export interface BaseProfileEntityInterface {
  id: string;
  userId: string;
  dateCreated: AuditDateCreated;
  dateUpdated: AuditDateUpdated;
  dateDeleted: AuditDateDeleted;
  version: AuditVersion;
}

/**
 * Generic profile entity interface
 * This is a generic interface that can be extended by clients
 */
export interface ProfileEntityInterface extends BaseProfileEntityInterface {}

/**
 * Generic profile creatable interface
 * Used for creating new profiles with custom data
 */
export interface ProfileCreatableInterface {
  userId: string;
  [key: string]: unknown;
}

/**
 * Generic profile updatable interface (for API)
 * Used for updating existing profiles with custom data
 */
export interface ProfileUpdatableInterface {}

/**
 * Generic profile model updatable interface (for model service)
 * Includes ID for model service operations
 */
export interface ProfileModelUpdatableInterface
  extends ProfileUpdatableInterface {
  id: string;
}

/**
 * Generic profile model service interface
 * Defines the contract for profile model services
 * Follows SDK patterns for service interfaces
 */
export interface ProfileModelServiceInterface {
  /**
   * Find profile by user ID
   */
  findByUserId(userId: string): Promise<ProfileEntityInterface | null>;

  /**
   * Create or update profile for a user
   * Main method used by controllers
   */
  createOrUpdate(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<ProfileEntityInterface>;

  /**
   * Get profile by user ID with proper error handling
   */
  getProfileByUserId(userId: string): Promise<ProfileEntityInterface>;

  /**
   * Get profile by ID with proper error handling
   */
  getProfileById(id: string): Promise<ProfileEntityInterface>;

  /**
   * Update profile data
   */
  updateProfile(
    userId: string,
    profileData: ProfileUpdatableInterface,
  ): Promise<ProfileEntityInterface>;
}

/**
 * Generic DTO class for profile operations
 * This can be extended by clients with their own validation rules
 */
export class BaseProfileDto {
  userId?: string;
}

/**
 * Generic create DTO class
 * This can be extended by clients with their own validation rules
 */
export class BaseProfileCreateDto extends BaseProfileDto {
  userId!: string;
}

/**
 * Generic update DTO class
 * This can be extended by clients with their own validation rules
 */
export class BaseProfileUpdateDto extends BaseProfileDto {
  // Only profile can be updated, userId is immutable
}
