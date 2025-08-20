import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserModelService } from '@concepta/nestjs-user';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
import { RocketsServerUserDto } from '../../dto/user/rockets-server-user.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { RocketsServerUserProfileModelService } from '../../rockets-server.constants';
import { RocketsServerUserProfileModelServiceInterface } from '@user-profile';

type SortOrder = 'ASC' | 'DESC';

interface AdminUsersFilterQuery {
  user?: Record<string, unknown>;
  profile?: Record<string, unknown>;
}

interface AdminUsersSortField {
  field: string; // e.g. 'user.username' or 'profile.firstName'
  order: SortOrder;
}

function tryParseJson<T>(input: string | undefined): T | undefined {
  if (!input) return undefined;
  try {
    return JSON.parse(input) as T;
  } catch {
    return undefined;
  }
}

function isProfileField(field: string): boolean {
  return field.startsWith('profile.');
}

@Controller('admin/users')
@UseGuards(AdminGuard)
@ApiTags('admin')
@ApiBearerAuth()
export class RocketsServerAdminUserController {
  constructor(
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
    @Inject(RocketsServerUserProfileModelService)
    private readonly userProfileModelService: RocketsServerUserProfileModelServiceInterface,
  ) {}

  @ApiOperation({ summary: 'List users with joined profiles' })
  @ApiOkResponse({ type: RocketsServerUserDto, isArray: true })
  @Get('')
  async getMany(
    @Query('filter') filterStr?: string,
    @Query('sort') sortStr?: string,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ): Promise<RocketsServerUserEntityInterface[] | { data: RocketsServerUserEntityInterface[]; count?: number; total?: number; page?: number; pageCount?: number }>
  {
    const filter = tryParseJson<AdminUsersFilterQuery>(filterStr) || {};
    const sort = tryParseJson<AdminUsersSortField[]>(sortStr) || [];
    const limit = limitStr ? Number(limitStr) : undefined;
    const offset = offsetStr ? Number(offsetStr) : undefined;

    let userIdsConstraint: string[] | undefined;
    if (filter.profile && Object.keys(filter.profile).length > 0) {
      const profiles = await this.userProfileModelService.find({ where: filter.profile as any });
      userIdsConstraint = profiles.map((p) => p.userId);
      if (userIdsConstraint.length === 0) {
        return [];
      }
    }

    const userWhere: Record<string, unknown> = { ...(filter.user || {}) };
    if (userIdsConstraint) {
      (userWhere as any).id = userIdsConstraint;
    }

    const users = await this.userModelService.find({
      where: userWhere as any,
      take: limit,
      skip: offset,
    });

    const ids = users.map((u) => u.id);
    const profiles = ids.length
      ? await this.userProfileModelService.find({ where: { userId: ids } as any })
      : [];
    const idToProfile = new Map(profiles.map((p) => [p.userId, p]));
    let merged = users.map((u) => ({ ...(u as any), profile: idToProfile.get(u.id) || undefined })) as RocketsServerUserEntityInterface[];

    if (sort.length) {
      merged = this.sortMerged(merged, sort);
    }

    return merged;
  }

  @ApiOperation({ summary: 'Get user with profile' })
  @ApiOkResponse({ type: RocketsServerUserDto })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<RocketsServerUserEntityInterface | null> {
    const user = await this.userModelService.byId(id);
    if (!user) return null;
    const profiles = await this.userProfileModelService.find({ where: { userId: id } as any });
    const profile = profiles[0];
    return { ...(user as any), profile: profile || undefined } as RocketsServerUserEntityInterface;
  }

  @ApiOperation({ summary: 'Update user and profile' })
  @ApiOkResponse({ type: RocketsServerUserDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<RocketsServerUserEntityInterface & { profile?: Partial<UserProfileEntityInterface> }>,
  ): Promise<RocketsServerUserEntityInterface> {
    const { profile, id: _ignoreId, ...userFields } = body as any;
    const updatedUser = Object.keys(userFields).length
      ? await this.userModelService.update({ ...(userFields as any), id })
      : (await this.userModelService.byId(id))!;

    if (profile) {
      const existing = (await this.userProfileModelService.find({ where: { userId: id } as any }))[0];
      if (existing) {
        await this.userProfileModelService.update({ ...(existing as any), ...(profile as any) } as any);
      } else {
        await this.userProfileModelService.create({ ...(profile as any), userId: id } as any);
      }
    }

    const mergedProfile = (await this.userProfileModelService.find({ where: { userId: id } as any }))[0];
    return { ...(updatedUser as any), profile: mergedProfile || undefined } as RocketsServerUserEntityInterface;
  }

  private sortMerged(
    data: RocketsServerUserEntityInterface[],
    sort: AdminUsersSortField[],
  ): RocketsServerUserEntityInterface[] {
    const compare = (a: RocketsServerUserEntityInterface, b: RocketsServerUserEntityInterface): number => {
      for (const s of sort) {
        const isProfile = isProfileField(s.field);
        const field = isProfile ? s.field.replace(/^profile\./, '') : s.field.replace(/^user\./, '');
        const av = (isProfile ? (a as any)?.profile : (a as any))[field];
        const bv = (isProfile ? (b as any)?.profile : (b as any))[field];
        if (av == null && bv == null) continue;
        if (av == null) return s.order === 'ASC' ? -1 : 1;
        if (bv == null) return s.order === 'ASC' ? 1 : -1;
        if (av < bv) return s.order === 'ASC' ? -1 : 1;
        if (av > bv) return s.order === 'ASC' ? 1 : -1;
      }
      return 0;
    };
    return [...data].sort(compare);
  }
}


