import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@concepta/nestjs-common';
import { BaseUserMetadataEntityInterface } from '../../modules/user-metadata/interfaces/user-metadata.interface';
import { UserMetadataEntityFixture } from '../entities/user-metadata.entity.fixture';

@Injectable()
export class UserMetadataRepositoryFixture
  implements RepositoryInterface<BaseUserMetadataEntityInterface>
{
  private userMetadata: Map<string, UserMetadataEntityFixture> = new Map();
  constructor() {
    // Initialize with some test data
    const userMetadata1 = new UserMetadataEntityFixture({
      id: 'userMetadata-1',
      userId: 'serverauth-user-1',
    });
    userMetadata1.firstName = 'John';
    userMetadata1.lastName = 'Doe';
    userMetadata1.bio = 'Test user userMetadata';
    userMetadata1.location = 'Test City';
    this.userMetadata.set('userMetadata-1', userMetadata1);

    const userMetadata2 = new UserMetadataEntityFixture({
      id: 'userMetadata-2',
      userId: 'firebase-user-1',
    });
    userMetadata2.firstName = 'Jane';
    userMetadata2.lastName = 'Smith';
    userMetadata2.bio = 'Firebase user userMetadata';
    userMetadata2.location = 'Firebase City';
    this.userMetadata.set('userMetadata-2', userMetadata2);
  }

  async findOne(options: {
    where: Record<string, unknown>;
  }): Promise<BaseUserMetadataEntityInterface | null> {
    const { where } = options;

    for (const userMetadata of this.userMetadata.values()) {
      if (where.userId && userMetadata.userId === where.userId) {
        return userMetadata;
      }
      if (where.id && userMetadata.id === where.id) {
        return userMetadata;
      }
      // Check userMetadata fields for email if it exists
      if (where.email && userMetadata.email === where.email) {
        return userMetadata;
      }
    }

    return null;
  }

  async findByUserId(
    userId: string,
  ): Promise<BaseUserMetadataEntityInterface | null> {
    return this.findOne({ where: { userId } });
  }

  async findByEmail(
    email: string,
  ): Promise<BaseUserMetadataEntityInterface | null> {
    return this.findOne({ where: { email } });
  }

  async find(): Promise<BaseUserMetadataEntityInterface[]> {
    return Array.from(this.userMetadata.values());
  }

  async save<T extends Partial<BaseUserMetadataEntityInterface>>(
    entities: T[],
    options?: unknown,
  ): Promise<(T & BaseUserMetadataEntityInterface)[]>;
  async save<T extends Partial<BaseUserMetadataEntityInterface>>(
    entity: T,
    options?: unknown,
  ): Promise<T & BaseUserMetadataEntityInterface>;
  async save<T extends Partial<BaseUserMetadataEntityInterface>>(
    entity: T | T[],
    options?: unknown,
  ): Promise<
    | (T & BaseUserMetadataEntityInterface)
    | (T & BaseUserMetadataEntityInterface)[]
  > {
    if (Array.isArray(entity)) {
      const savedEntities: (T & BaseUserMetadataEntityInterface)[] = [];
      for (const item of entity) {
        const savedEntity = (await this.save(item, options)) as T &
          BaseUserMetadataEntityInterface;
        savedEntities.push(savedEntity);
      }
      return savedEntities;
    }

    const userMetadata = new UserMetadataEntityFixture({
      ...entity,
      id: entity.id || `userMetadata-${Date.now()}`,
      dateUpdated: new Date(),
    } as BaseUserMetadataEntityInterface);

    this.userMetadata.set(userMetadata.id, userMetadata);
    return userMetadata as T & BaseUserMetadataEntityInterface;
  }

  create(
    entityLike: Partial<BaseUserMetadataEntityInterface>,
  ): BaseUserMetadataEntityInterface {
    const userMetadata = new UserMetadataEntityFixture({
      ...entityLike,
      id: entityLike.id || `userMetadata-${Date.now()}`,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    });

    this.userMetadata.set(userMetadata.id, userMetadata);
    return userMetadata;
  }

  async update(
    id: string,
    data: Partial<BaseUserMetadataEntityInterface>,
  ): Promise<BaseUserMetadataEntityInterface> {
    const existing = this.userMetadata.get(id);
    if (!existing) {
      throw new Error(`UserMetadata with id ${id} not found`);
    }

    const updated = new UserMetadataEntityFixture({
      ...existing,
      ...data,
      id,
      dateUpdated: new Date(),
    });

    this.userMetadata.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.userMetadata.delete(id);
  }

  async count(): Promise<number> {
    return this.userMetadata.size;
  }

  async findByIds(ids: string[]): Promise<BaseUserMetadataEntityInterface[]> {
    return ids
      .map((id) => this.userMetadata.get(id))
      .filter(
        (userMetadata): userMetadata is BaseUserMetadataEntityInterface =>
          userMetadata !== undefined,
      );
  }

  async clear(): Promise<void> {
    this.userMetadata.clear();
  }

  // Required by ModelService
  entityName(): string {
    return 'UserMetadataEntity';
  }

  async byId(id: string): Promise<BaseUserMetadataEntityInterface | null> {
    return this.userMetadata.get(id) || null;
  }

  // Additional RepositoryInterface methods
  merge(
    mergeIntoEntity: BaseUserMetadataEntityInterface,
    ...entityLikes: Partial<BaseUserMetadataEntityInterface>[]
  ): BaseUserMetadataEntityInterface {
    return Object.assign(mergeIntoEntity, ...entityLikes);
  }

  async remove(
    entities: BaseUserMetadataEntityInterface[],
  ): Promise<BaseUserMetadataEntityInterface[]>;
  async remove(
    entity: BaseUserMetadataEntityInterface,
  ): Promise<BaseUserMetadataEntityInterface>;
  async remove(
    entity: BaseUserMetadataEntityInterface | BaseUserMetadataEntityInterface[],
  ): Promise<
    BaseUserMetadataEntityInterface | BaseUserMetadataEntityInterface[]
  > {
    if (Array.isArray(entity)) {
      const removedEntities: BaseUserMetadataEntityInterface[] = [];
      for (const item of entity) {
        const removedEntity = (await this.remove(
          item,
        )) as BaseUserMetadataEntityInterface;
        removedEntities.push(removedEntity);
      }
      return removedEntities;
    }

    this.userMetadata.delete(entity.id);
    return entity;
  }

  gt<T>(value: T): { $gt: T } {
    return { $gt: value };
  }

  gte<T>(value: T): { $gte: T } {
    return { $gte: value };
  }

  lt<T>(value: T): { $lt: T } {
    return { $lt: value };
  }

  lte<T>(value: T): { $lte: T } {
    return { $lte: value };
  }
}
