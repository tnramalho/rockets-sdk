import { RocketsServerAuthUserUpdateDto } from '@bitwild/rockets-server-auth';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserUpdateDto extends IntersectionType(
  PartialType(PickType(UserDto, ['firstName', 'lastName'] as const)),
  RocketsServerAuthUserUpdateDto,
) {}