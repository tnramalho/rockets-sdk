import { 
  RocketsServerAuthUserEntityInterface,
  RocketsServerAuthUserInterface,
  RocketsServerAuthUserCreatableInterface,
  RocketsServerAuthUserUpdatableInterface 
} from '@bitwild/rockets-server-auth';

export interface UserEntityInterface extends RocketsServerAuthUserEntityInterface {
  age?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  tags?: string[];
  isVerified?: boolean;
  lastLoginAt?: Date;
}

export interface UserInterface extends RocketsServerAuthUserInterface {
  age?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  tags?: string[];
  isVerified?: boolean;
  lastLoginAt?: Date;
}

export interface UserCreatableInterface
  extends Pick<UserInterface, 'age' | 'firstName' | 'lastName'>,
    RocketsServerAuthUserCreatableInterface {}

export interface UserUpdatableInterface
  extends Partial<Pick<UserInterface, 'age' | 'firstName' | 'lastName'>>,
    RocketsServerAuthUserUpdatableInterface {}