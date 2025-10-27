import { UserDto } from '@concepta/nestjs-user';
import { RocketsAuthUserInterface } from '../interfaces/rockets-auth-user.interface';
import { RocketsAuthUserMetadataDto } from './rockets-auth-user-metadata.dto';

/**
 * Rockets Auth User DTO
 *
 * Extends the base user DTO from the user module
 */
export class RocketsAuthUserDto
  extends UserDto
  implements RocketsAuthUserInterface
{
  userMetadata?: RocketsAuthUserMetadataDto;
}
