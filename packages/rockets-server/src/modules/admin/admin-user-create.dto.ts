import { RocketsServerUserCreateDto } from '../../dto/user/rockets-server-user-create.dto';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

export class AdminUserCreateDto extends RocketsServerUserCreateDto {
  profile?: Partial<UserProfileEntityInterface>;
}


