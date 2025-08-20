import { Inject, Type } from '@nestjs/common';
import {
  CrudAdapter,
  CrudRequestInterface,
} from '@concepta/nestjs-crud';
import {
  UserProfileEntityInterface,
} from '@concepta/nestjs-common';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';

export const ADMIN_USER_COMPOSITE_USER_ADAPTER = Symbol(
  '__ADMIN_USER_COMPOSITE_USER_ADAPTER__',
);
export const ADMIN_USER_COMPOSITE_PROFILE_ADAPTER = Symbol(
  '__ADMIN_USER_COMPOSITE_PROFILE_ADAPTER__',
);

type Paginated<T> = {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

export interface AdminUserCompositeAdapterOptions {
  userEntityType: Type<RocketsServerUserEntityInterface>;
  profileFieldNames?: (keyof UserProfileEntityInterface)[];
}

export class AdminUserCompositeCrudAdapter extends CrudAdapter<RocketsServerUserEntityInterface> {
  constructor(
    @Inject(ADMIN_USER_COMPOSITE_USER_ADAPTER)
    private readonly userAdapter: CrudAdapter<RocketsServerUserEntityInterface>,
    @Inject(ADMIN_USER_COMPOSITE_PROFILE_ADAPTER)
    private readonly profileAdapter: CrudAdapter<UserProfileEntityInterface>,
    private readonly options: AdminUserCompositeAdapterOptions,
  ) {
    super();
  }

  entityType(): Type<RocketsServerUserEntityInterface> {
    return this.options.userEntityType;
  }

  entityName(): string {
    return 'user';
  }

  async getMany(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
  ): Promise<Paginated<RocketsServerUserEntityInterface> | RocketsServerUserEntityInterface[]> {
    const { userReq, profileReq } = this.splitRequest(req);

    // If there are profile-level filters, pre-filter users by matching profile userIds
    let restrictedUserReq = userReq;
    if (profileReq) {
      const profRes = await this.profileAdapter.getMany(profileReq);
      const profileList = Array.isArray(profRes)
        ? profRes
        : ((profRes as Paginated<UserProfileEntityInterface>).data || []);
      const userIds = profileList.map((p) => p.userId);
      restrictedUserReq = this.mergeUserIdInFilter(userReq, userIds);
    }

    const usersRes = await this.userAdapter.getMany(restrictedUserReq);
    const users = Array.isArray(usersRes)
      ? usersRes
      : ((usersRes as Paginated<RocketsServerUserEntityInterface>).data || []);
    const userIds = users.map((u) => u.id);

    let profiles: UserProfileEntityInterface[] = [];
    if (userIds.length > 0) {
      const profileManyReq = this.buildProfileInReq(req, userIds);
      const profRes = await this.profileAdapter.getMany(profileManyReq);
      profiles = Array.isArray(profRes)
        ? profRes
        : ((profRes as Paginated<UserProfileEntityInterface>).data || []);
    }
    const idToProfile = new Map(profiles.map((p) => [p.userId, p]));
    const merged = users.map((u) => ({ ...u, profile: idToProfile.get(u.id) }));

    if (Array.isArray(usersRes)) return merged;
    const pag = usersRes as Paginated<RocketsServerUserEntityInterface>;
    return { ...pag, data: merged };
  }

  async getOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
  ): Promise<RocketsServerUserEntityInterface> {
    const user = await this.userAdapter.getOne(req);
    if (!user?.id) return user;
    const profReq = this.buildProfileEqReq(req, user.id);
    const profRes = await this.profileAdapter.getMany(profReq);
    const profile = Array.isArray(profRes)
      ? profRes[0]
      : (profRes as Paginated<UserProfileEntityInterface>).data?.[0];
    return { ...user, profile: profile || undefined } as RocketsServerUserEntityInterface;
  }

  async createOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    dto: RocketsServerUserEntityInterface | Partial<RocketsServerUserEntityInterface>,
  ): Promise<RocketsServerUserEntityInterface> {
    // Delegate to user only by default
    return this.userAdapter.createOne(req, dto);
  }

  async createMany(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    dto: { bulk: RocketsServerUserEntityInterface[] },
  ): Promise<RocketsServerUserEntityInterface[]> {
    return this.userAdapter.createMany(req, dto as any);
  }

  async updateOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    dto: RocketsServerUserEntityInterface | Partial<RocketsServerUserEntityInterface>,
  ): Promise<RocketsServerUserEntityInterface> {
    const { profile, ...userDto } = (dto as any) || {};
    const user = await this.userAdapter.updateOne(req, userDto);
    if (profile) {
      const existingRes = await this.profileAdapter.getMany(
        this.buildProfileEqReq(req, (user as any).id),
      );
      const current = Array.isArray(existingRes)
        ? existingRes[0]
        : (existingRes as Paginated<UserProfileEntityInterface>).data?.[0];
      if (current) {
        await this.profileAdapter.updateOne(req as any, { ...current, ...profile });
      } else {
        await this.profileAdapter.createOne(req as any, {
          ...(profile as any),
          userId: (user as any).id,
        });
      }
    }
    const profRes = await this.profileAdapter.getMany(
      this.buildProfileEqReq(req, (user as any).id),
    );
    const mergedProfile = Array.isArray(profRes)
      ? profRes[0]
      : (profRes as Paginated<UserProfileEntityInterface>).data?.[0];
    return { ...(user as any), profile: mergedProfile || undefined } as RocketsServerUserEntityInterface;
  }

  async replaceOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    dto: RocketsServerUserEntityInterface | Partial<RocketsServerUserEntityInterface>,
  ): Promise<RocketsServerUserEntityInterface> {
    return this.userAdapter.replaceOne(req, dto);
  }

  async deleteOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
  ): Promise<void | RocketsServerUserEntityInterface> {
    return this.userAdapter.deleteOne(req);
  }

  async recoverOne(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
  ): Promise<void | RocketsServerUserEntityInterface> {
    return this.userAdapter.recoverOne(req);
  }

  // --- helpers
  private splitRequest(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
  ): {
    userReq: CrudRequestInterface<RocketsServerUserEntityInterface>;
    profileReq?: CrudRequestInterface<UserProfileEntityInterface>;
  } {
    const profileFields = new Set<string>(
      (this.options.profileFieldNames as string[]) || [],
    );
    const userFilters = (req.parsed.filter || []).filter(
      (f) => !profileFields.has(String(f.field)),
    );
    const profileFilters = (req.parsed.filter || []).filter((f) =>
      profileFields.has(String(f.field)),
    ) as any[];

    const userReq: CrudRequestInterface<RocketsServerUserEntityInterface> = {
      ...req,
      parsed: { ...req.parsed, filter: userFilters as any },
    };

    if (!profileFilters.length) return { userReq };

    const profileReq: CrudRequestInterface<UserProfileEntityInterface> = {
      ...(req as any),
      parsed: { ...req.parsed, filter: profileFilters as any },
    };

    return { userReq, profileReq };
  }

  private mergeUserIdInFilter(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    userIds: string[],
  ): CrudRequestInterface<RocketsServerUserEntityInterface> {
    const baseFilters = req.parsed.filter || [];
    return {
      ...req,
      parsed: {
        ...req.parsed,
        filter: [...baseFilters, { field: 'id' as any, operator: '$in', value: userIds }],
      },
    };
  }

  private buildProfileInReq(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    userIds: string[],
  ): CrudRequestInterface<UserProfileEntityInterface> {
    return {
      ...(req as any),
      parsed: {
        ...req.parsed,
        filter: [{ field: 'userId' as any, operator: '$in', value: userIds }],
      },
    } as any;
  }

  private buildProfileEqReq(
    req: CrudRequestInterface<RocketsServerUserEntityInterface>,
    userId: string,
  ): CrudRequestInterface<UserProfileEntityInterface> {
    return {
      ...(req as any),
      parsed: {
        ...req.parsed,
        filter: [{ field: 'userId' as any, operator: '$eq', value: userId }],
      },
    } as any;
  }
}


