import { Injectable } from '@nestjs/common';
import {
  RepositoryInterface,
  ModelService,
  InjectDynamicRepository,
} from '@concepta/nestjs-common';
import {
  UserMetadataEntityInterface,
  UserMetadataCreatableInterface,
  UserMetadataUpdatableInterface,
  UserMetadataModelUpdatableInterface,
  UserMetadataModelServiceInterface,
} from '../interfaces/user-metadata.interface';
import { USER_METADATA_MODULE_ENTITY_KEY } from '../constants/user-metadata.constants';

@Injectable()
export class GenericUserMetadataModelService
  extends ModelService<
    UserMetadataEntityInterface,
    UserMetadataCreatableInterface,
    UserMetadataModelUpdatableInterface
  >
  implements UserMetadataModelServiceInterface
{
  public readonly createDto: new () => UserMetadataCreatableInterface;
  public readonly updateDto: new () => UserMetadataModelUpdatableInterface;

  constructor(
    @InjectDynamicRepository(USER_METADATA_MODULE_ENTITY_KEY)
    public readonly repo: RepositoryInterface<UserMetadataEntityInterface>,
    createDto: new () => UserMetadataCreatableInterface,
    updateDto: new () => UserMetadataModelUpdatableInterface,
  ) {
    super(repo);
    this.createDto = createDto;
    this.updateDto = updateDto;
  }

  async getUserMetadataById(id: string): Promise<UserMetadataEntityInterface> {
    const userMetadata = await this.byId(id);
    if (!userMetadata) {
      throw new Error(`UserMetadata with ID ${id} not found`);
    }
    return userMetadata;
  }

  async updateUserMetadata(
    userId: string,
    userMetadataData: UserMetadataUpdatableInterface,
  ): Promise<UserMetadataEntityInterface> {
    const userMetadata = await this.getUserMetadataByUserId(userId);
    return this.update({
      ...userMetadata,
      ...userMetadataData,
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<UserMetadataEntityInterface | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async hasUserMetadata(userId: string): Promise<boolean> {
    const userMetadata = await this.findByUserId(userId);
    return !!userMetadata;
  }

  async createOrUpdate(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<UserMetadataEntityInterface> {
    const existingUserMetadata = await this.findByUserId(userId);

    if (existingUserMetadata) {
      // Update existing userMetadata with new data
      const updateData = { id: existingUserMetadata.id, ...data };
      return this.update(updateData);
    } else {
      // Create new userMetadata with user ID and userMetadata data
      const createData = { userId, ...data };
      return this.create(createData);
    }
  }

  async getUserMetadataByUserId(
    userId: string,
  ): Promise<UserMetadataEntityInterface> {
    const userMetadata = await this.findByUserId(userId);
    if (!userMetadata) {
      throw new Error(`UserMetadata for user ID ${userId} not found`);
    }
    return userMetadata;
  }

  async update(
    data: UserMetadataModelUpdatableInterface,
  ): Promise<UserMetadataEntityInterface> {
    const { id } = data;
    if (!id) {
      throw new Error('ID is required for update operation');
    }
    // Get existing entity and merge with update data
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new Error(`UserMetadata with ID ${id} not found`);
    }
    return super.update(data);
  }
}
