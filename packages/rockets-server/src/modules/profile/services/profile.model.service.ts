import { Injectable } from '@nestjs/common';
import {
  RepositoryInterface,
  ModelService,
  InjectDynamicRepository,
} from '@concepta/nestjs-common';
import {
  ProfileEntityInterface,
  ProfileCreatableInterface,
  ProfileUpdatableInterface,
  ProfileModelUpdatableInterface,
  ProfileModelServiceInterface,
} from '../interfaces/profile.interface';
import { PROFILE_MODULE_PROFILE_ENTITY_KEY } from '../constants/profile.constants';

@Injectable()
export class GenericProfileModelService
  extends ModelService<
    ProfileEntityInterface,
    ProfileCreatableInterface,
    ProfileModelUpdatableInterface
  >
  implements ProfileModelServiceInterface
{
  public readonly createDto: new () => ProfileCreatableInterface;
  public readonly updateDto: new () => ProfileModelUpdatableInterface;

  constructor(
    @InjectDynamicRepository(PROFILE_MODULE_PROFILE_ENTITY_KEY)
    public readonly repo: RepositoryInterface<ProfileEntityInterface>,
    createDto: new () => ProfileCreatableInterface,
    updateDto: new () => ProfileModelUpdatableInterface,
  ) {
    super(repo);
    this.createDto = createDto;
    this.updateDto = updateDto;
  }

  async getProfileById(id: string): Promise<ProfileEntityInterface> {
    const profile = await this.byId(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    profileData: ProfileUpdatableInterface,
  ): Promise<ProfileEntityInterface> {
    const profile = await this.getProfileByUserId(userId);
    return this.update({
      ...profile,
      ...profileData,
    });
  }

  async findByUserId(userId: string): Promise<ProfileEntityInterface | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async hasProfile(userId: string): Promise<boolean> {
    const profile = await this.findByUserId(userId);
    return !!profile;
  }

  async createOrUpdate(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<ProfileEntityInterface> {
    const existingProfile = await this.findByUserId(userId);

    if (existingProfile) {
      // Update existing profile with new data
      const updateData = { id: existingProfile.id, ...data };
      return this.update(updateData);
    } else {
      // Create new profile with user ID and profile data
      const createData = { userId, ...data };
      return this.create(createData);
    }
  }

  async getProfileByUserId(userId: string): Promise<ProfileEntityInterface> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new Error(`Profile for user ID ${userId} not found`);
    }
    return profile;
  }

  async update(
    data: ProfileModelUpdatableInterface,
  ): Promise<ProfileEntityInterface> {
    const { id } = data;
    if (!id) {
      throw new Error('ID is required for update operation');
    }
    // Get existing entity and merge with update data
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return super.update(data);
  }
}
