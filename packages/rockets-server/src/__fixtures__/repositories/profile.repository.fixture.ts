import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@concepta/nestjs-common';
import { BaseProfileEntityInterface } from '../../modules/profile/interfaces/profile.interface';
import { ProfileEntityFixture } from '../entities/profile.entity.fixture';

@Injectable()
export class ProfileRepositoryFixture
  implements RepositoryInterface<BaseProfileEntityInterface>
{
  private profiles: Map<string, BaseProfileEntityInterface> = new Map();

  constructor() {
    // Initialize with some test data
    const profile1 = new ProfileEntityFixture({
      id: 'profile-1',
      userId: 'serverauth-user-1',
    });
    (profile1 as any).firstName = 'John';
    (profile1 as any).lastName = 'Doe';
    (profile1 as any).bio = 'Test user profile';
    (profile1 as any).location = 'Test City';
    this.profiles.set('profile-1', profile1);

    const profile2 = new ProfileEntityFixture({
      id: 'profile-2',
      userId: 'firebase-user-1',
    });
    (profile2 as any).firstName = 'Jane';
    (profile2 as any).lastName = 'Smith';
    (profile2 as any).bio = 'Firebase user profile';
    (profile2 as any).location = 'Firebase City';
    this.profiles.set('profile-2', profile2);
  }

  async findOne(options: {
    where: Record<string, unknown>;
  }): Promise<BaseProfileEntityInterface | null> {
    const { where } = options;

    for (const profile of this.profiles.values()) {
      if (where.userId && profile.userId === where.userId) {
        return profile;
      }
      if (where.id && profile.id === where.id) {
        return profile;
      }
      // Check profile fields for email if it exists
      if (where.email && (profile as any).email === where.email) {
        return profile;
      }
    }

    return null;
  }

  async findByUserId(
    userId: string,
  ): Promise<BaseProfileEntityInterface | null> {
    return this.findOne({ where: { userId } });
  }

  async findByEmail(email: string): Promise<BaseProfileEntityInterface | null> {
    return this.findOne({ where: { email } });
  }

  async find(): Promise<BaseProfileEntityInterface[]> {
    return Array.from(this.profiles.values());
  }

  async save<T extends Partial<BaseProfileEntityInterface>>(
    entities: T[],
    options?: any,
  ): Promise<(T & BaseProfileEntityInterface)[]>;
  async save<T extends Partial<BaseProfileEntityInterface>>(
    entity: T,
    options?: any,
  ): Promise<T & BaseProfileEntityInterface>;
  async save<T extends Partial<BaseProfileEntityInterface>>(
    entity: T | T[],
    options?: any,
  ): Promise<
    (T & BaseProfileEntityInterface) | (T & BaseProfileEntityInterface)[]
  > {
    if (Array.isArray(entity)) {
      const savedEntities: (T & BaseProfileEntityInterface)[] = [];
      for (const item of entity) {
        const savedEntity = (await this.save(item, options)) as T &
          BaseProfileEntityInterface;
        savedEntities.push(savedEntity);
      }
      return savedEntities;
    }

    const profile = new ProfileEntityFixture({
      ...entity,
      id: entity.id || `profile-${Date.now()}`,
      dateUpdated: new Date(),
    } as BaseProfileEntityInterface);

    this.profiles.set(profile.id, profile);
    return profile as T & BaseProfileEntityInterface;
  }

  create(
    entityLike: Partial<BaseProfileEntityInterface>,
  ): BaseProfileEntityInterface {
    const profile = new ProfileEntityFixture({
      ...entityLike,
      id: entityLike.id || `profile-${Date.now()}`,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    });

    this.profiles.set(profile.id, profile);
    return profile;
  }

  async update(
    id: string,
    data: Partial<BaseProfileEntityInterface>,
  ): Promise<BaseProfileEntityInterface> {
    const existing = this.profiles.get(id);
    if (!existing) {
      throw new Error(`Profile with id ${id} not found`);
    }

    const updated = new ProfileEntityFixture({
      ...existing,
      ...data,
      id,
      dateUpdated: new Date(),
    });

    this.profiles.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.profiles.delete(id);
  }

  async count(): Promise<number> {
    return this.profiles.size;
  }

  async findByIds(ids: string[]): Promise<BaseProfileEntityInterface[]> {
    return ids
      .map((id) => this.profiles.get(id))
      .filter(
        (profile): profile is BaseProfileEntityInterface =>
          profile !== undefined,
      );
  }

  async clear(): Promise<void> {
    this.profiles.clear();
  }

  // Required by ModelService
  entityName(): string {
    return 'ProfileEntity';
  }

  async byId(id: string): Promise<BaseProfileEntityInterface | null> {
    return this.profiles.get(id) || null;
  }

  // Additional RepositoryInterface methods
  merge(
    mergeIntoEntity: BaseProfileEntityInterface,
    ...entityLikes: Partial<BaseProfileEntityInterface>[]
  ): BaseProfileEntityInterface {
    return Object.assign(mergeIntoEntity, ...entityLikes);
  }

  async remove(
    entities: BaseProfileEntityInterface[],
  ): Promise<BaseProfileEntityInterface[]>;
  async remove(
    entity: BaseProfileEntityInterface,
  ): Promise<BaseProfileEntityInterface>;
  async remove(
    entity: BaseProfileEntityInterface | BaseProfileEntityInterface[],
  ): Promise<BaseProfileEntityInterface | BaseProfileEntityInterface[]> {
    if (Array.isArray(entity)) {
      const removedEntities: BaseProfileEntityInterface[] = [];
      for (const item of entity) {
        const removedEntity = (await this.remove(
          item,
        )) as BaseProfileEntityInterface;
        removedEntities.push(removedEntity);
      }
      return removedEntities;
    }

    this.profiles.delete(entity.id);
    return entity;
  }

  gt<T>(value: T): any {
    return { $gt: value };
  }

  gte<T>(value: T): any {
    return { $gte: value };
  }

  lt<T>(value: T): any {
    return { $lt: value };
  }

  lte<T>(value: T): any {
    return { $lte: value };
  }
}
