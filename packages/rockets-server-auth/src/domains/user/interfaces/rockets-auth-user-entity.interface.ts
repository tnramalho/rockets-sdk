import { UserEntityInterface } from '@concepta/nestjs-common';
import { RocketsAuthUserMetadataEntityInterface } from './rockets-auth-user-metadata-entity.interface';

/**
 * User Entity Interface
 *
 * Extends the base user entity interface from the user module
 */
export interface RocketsAuthUserEntityInterface extends UserEntityInterface {
  /**
   * When extending the base interface, you can add additional properties
   * specific to your application here
   */
  userMetadata?: RocketsAuthUserMetadataEntityInterface | null;
}
