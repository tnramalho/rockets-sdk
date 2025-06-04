import { UserCreateDto, UserPasswordDto } from '@concepta/nestjs-user';
import { IntersectionType } from '@nestjs/swagger';

/**
 * Rockets Server User Create DTO
 *
 * Extends the base user create DTO from the user module
 */
export class RocketsServerUserCreateDto extends IntersectionType(
  UserCreateDto,
  UserPasswordDto,
) {}
