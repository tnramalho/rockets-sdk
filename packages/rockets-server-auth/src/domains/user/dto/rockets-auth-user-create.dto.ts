import { UserPasswordDto } from '@concepta/nestjs-user';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { RocketsAuthUserCreatableInterface } from '../interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserDto } from './rockets-auth-user.dto';

/**
 * Rockets Server User Create DTO
 *
 * Extends the base user create DTO from the user module
 */
export class RocketsAuthUserCreateDto
  extends IntersectionType(
    PickType(RocketsAuthUserDto, [
      'email',
      'username',
      'active',
      // Allow nested metadata during signup
      'userMetadata',
    ] as const),
    UserPasswordDto,
  )
  implements RocketsAuthUserCreatableInterface {}
