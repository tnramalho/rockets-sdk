import { UserDto } from '@concepta/nestjs-user';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

/**
 * Rockets Server User DTO
 *
 * Extends the base user DTO from the user module
 */
export class RocketsServerUserDto extends UserDto {
  /**
   * When extending the base DTO, you can add additional properties
   * specific to your application here
   */
  profile?: UserProfileEntityInterface;
}
