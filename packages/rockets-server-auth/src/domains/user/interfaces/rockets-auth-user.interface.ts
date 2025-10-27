import { UserInterface } from '@concepta/nestjs-common';
import { RocketsAuthUserMetadataEntityInterface } from './rockets-auth-user-metadata-entity.interface';

/**
 * Rockets Server User Interface (DTO shape)
 *
 * Extends the base user interface.
 */
export interface RocketsAuthUserInterface extends UserInterface {
  userMetadata?:
    | Record<string, unknown>
    | RocketsAuthUserMetadataEntityInterface;
}
