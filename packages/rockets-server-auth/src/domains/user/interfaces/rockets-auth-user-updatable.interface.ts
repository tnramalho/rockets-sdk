import { RocketsAuthUserCreatableInterface } from './rockets-auth-user-creatable.interface';
import { RocketsAuthUserInterface } from './rockets-auth-user.interface';

/**
 * Rockets Server User Updatable Interface
 *
 */
export interface RocketsAuthUserUpdatableInterface
  extends Pick<RocketsAuthUserInterface, 'id'>,
    Partial<
      Pick<RocketsAuthUserCreatableInterface, 'email' | 'username' | 'active'>
    > {}
