import { UserDto } from '@concepta/nestjs-user';
import { RocketsAuthUserInterface } from '../interfaces/rockets-auth-user.interface';

/**
 * Rockets Server User DTO
 *
 * Extends the base user DTO from the user module
 */
export class RocketsAuthUserDto
  extends UserDto
  implements RocketsAuthUserInterface {}
