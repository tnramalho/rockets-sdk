import { UserUpdateDto } from '@concepta/nestjs-user';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

/**
 * Rockets Server User Update DTO
 *
 * Extends the base user update DTO from the user module
 */
export class RocketsServerUserUpdateDto extends UserUpdateDto {
  /**
   * When extending the base DTO, you can add additional properties
   * specific to your application here
   */
  profile?: Partial<UserProfileEntityInterface>;
}
