import {
  CreateOneInterface,
  RemoveOneInterface,
  UpdateOneInterface,
  UserProfileCreatableInterface,
  UserProfileEntityInterface,
} from '@concepta/nestjs-common';

export interface RocketsServerUserProfileModelServiceInterface
  extends CreateOneInterface<UserProfileCreatableInterface, UserProfileEntityInterface>,
  UpdateOneInterface<UserProfileEntityInterface, UserProfileEntityInterface>,
  RemoveOneInterface<Pick<UserProfileEntityInterface, 'id'>, UserProfileEntityInterface>
{
  byUserId(userId: string): Promise<UserProfileEntityInterface | null>;
}
