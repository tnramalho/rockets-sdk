import { RocketsServerAuthUserCreateDto } from '@bitwild/rockets-server-auth';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserCreateDto extends IntersectionType(
  PickType(UserDto, ['firstName', 'lastName'] as const),
  RocketsServerAuthUserCreateDto,
) {}