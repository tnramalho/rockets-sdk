import { PickType } from '@nestjs/swagger';
import { RocketsAuthUserUpdatableInterface } from '../../../domains/user/interfaces/rockets-auth-user-updatable.interface';
import { RocketsAuthUserDtoFixture } from './rockets-auth-user.dto.fixture';

/**
 * Test-specific DTO with age validation for user update tests
 *
 * This DTO includes age validation for testing purposes across e2e tests
 * without affecting the main project DTOs
 */
export class RocketsAuthUserUpdateDtoFixture
  extends PickType(RocketsAuthUserDtoFixture, [
    'id',
    'username',
    'email',
    'firstName',
    'active',
    'age',
  ] as const)
  implements RocketsAuthUserUpdatableInterface {}
