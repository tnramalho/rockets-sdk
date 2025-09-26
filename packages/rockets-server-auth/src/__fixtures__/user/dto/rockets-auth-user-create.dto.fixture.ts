import { UserPasswordDto } from '@concepta/nestjs-user';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { RocketsAuthUserCreatableInterface } from '../../../domains/user/interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserDtoFixture } from './rockets-auth-user.dto.fixture';

/**
 * Test-specific DTO with age validation for user create tests
 *
 * This DTO includes age validation for testing purposes across e2e tests
 * without affecting the main project DTOs
 */
export class RocketsAuthUserCreateDtoFixture
  extends IntersectionType(
    PickType(RocketsAuthUserDtoFixture, [
      'email',
      'username',
      'active',
      'age',
    ] as const),
    UserPasswordDto,
  )
  implements RocketsAuthUserCreatableInterface {}
