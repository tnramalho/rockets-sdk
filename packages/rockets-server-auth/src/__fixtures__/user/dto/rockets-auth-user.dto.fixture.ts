import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsNumber, IsOptional, Min } from 'class-validator';
import { RocketsAuthUserDto } from '../../../domains/user/dto/rockets-auth-user.dto';
import { RocketsAuthUserInterface } from '../../../domains/user/interfaces/rockets-auth-user.interface';
import { Expose } from 'class-transformer';

/**
 * Test-specific DTO with age validation for user create tests
 *
 * This DTO includes age validation for testing purposes across e2e tests
 * without affecting the main project DTOs
 */
export class RocketsAuthUserDtoFixture
  extends RocketsAuthUserDto
  implements RocketsAuthUserInterface
{
  @ApiPropertyOptional()
  @Allow()
  @IsOptional()
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User age',
    example: 25,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18 years old' })
  @Expose()
  age?: number;
}
