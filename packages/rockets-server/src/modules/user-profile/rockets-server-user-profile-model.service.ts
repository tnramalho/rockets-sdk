import { Injectable, Type } from '@nestjs/common';
import {
  InjectDynamicRepository,
  ModelService,
  RepositoryInterface,
  UserProfileCreatableInterface,
  UserProfileEntityInterface,
} from '@concepta/nestjs-common';
import { ROCKETS_SERVER_USER_PROFILE_REPOSITORY_KEY } from '../../rockets-server.constants';
import { RocketsServerUserProfileModelServiceInterface } from './interfaces/rockets-server-user-profile-model-service.interface';

/**
 * Rockets Server User Profile Service
 * 
 * This is a default implementation of the user profile service that provides
 * basic functionality. It can be overridden by providing a custom service
 * through the module configuration.
 * 
 * Note: This service does not extend ModelService as it's meant to be a
 * lightweight default implementation. For full CRUD functionality, extend
 * the appropriate ModelService from @concepta/nestjs-common.
 */
@Injectable()
export class UserProfileModelService
  extends ModelService<
    UserProfileEntityInterface,
    UserProfileCreatableInterface,
    UserProfileCreatableInterface & Pick<UserProfileEntityInterface, 'id'>,
    UserProfileCreatableInterface & Pick<UserProfileEntityInterface, 'id'>
  > implements RocketsServerUserProfileModelServiceInterface
{
  protected createDto!: Type<UserProfileCreatableInterface>;
  protected updateDto!: Type<UserProfileCreatableInterface & { id: string}>;
  constructor(
    @InjectDynamicRepository(ROCKETS_SERVER_USER_PROFILE_REPOSITORY_KEY)
    repo: RepositoryInterface<UserProfileEntityInterface>,
  ) {
    super(repo);
  }

  public async byUserId(userId: string): Promise<UserProfileEntityInterface | null> {
    return this.repo.findOne({
      where: { userId },
    });
  }

}
