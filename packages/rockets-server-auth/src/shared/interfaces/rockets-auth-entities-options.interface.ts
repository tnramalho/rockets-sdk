import {
  RepositoryEntityOptionInterface,
  UserEntityInterface,
  UserPasswordHistoryEntityInterface,
  UserEntityInterface as UserMetadataEntityInterface,
} from '@concepta/nestjs-common';

export interface RocketsAuthEntitiesOptionsInterface {
  entities: {
    user: RepositoryEntityOptionInterface<UserEntityInterface>;
    userPasswordHistory?: RepositoryEntityOptionInterface<UserPasswordHistoryEntityInterface>;
    userMetadata?: RepositoryEntityOptionInterface<UserMetadataEntityInterface>;
    userOtp: RepositoryEntityOptionInterface;
  };
}
