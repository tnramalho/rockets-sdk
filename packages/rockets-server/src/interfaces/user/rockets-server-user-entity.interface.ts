import { UserEntityInterface, UserProfileEntityInterface } from '@concepta/nestjs-common';

/**
 * User Entity Interface
 *
 * Extends the base user entity interface from the user module
 */
export interface RocketsServerUserEntityInterface extends UserEntityInterface {
  /**
   * When extending the base interface, you can add additional properties
   * specific to your application here
   */
  profileId?: string;
  profile?: UserProfileEntityInterface;
}
