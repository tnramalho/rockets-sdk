import { UserPasswordDto } from '@concepta/nestjs-user';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { RocketsAuthUserCreatableInterface } from '../../../domains/user/interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserFixtureDto } from './rockets-auth-user.dto.fixture';

/**
 * Test-specific DTO for user create tests
 *
 * This DTO is used for testing purposes across e2e tests
 * without affecting the main project DTOs.
 *
 * Note: Properties like age, firstName, lastName should be in userMetadata.
 */
export class RocketsAuthUserCreateDtoFixture
  extends IntersectionType(
    PickType(RocketsAuthUserFixtureDto, [
      'email',
      'username',
      'active',
      'userMetadata',
    ] as const),
    UserPasswordDto,
  )
  implements RocketsAuthUserCreatableInterface {}
