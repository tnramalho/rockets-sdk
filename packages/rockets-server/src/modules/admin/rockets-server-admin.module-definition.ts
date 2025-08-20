import { ConfigurableModuleBuilder, DynamicModule, Provider, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigurableCrudBuilder, CrudRequestInterface, CrudService } from '@concepta/nestjs-crud';
import { AdminOptionsExtrasInterface } from './admin-options-extras.interface';
import { AdminOptionsInterface } from './interfaces/admin-options.interface';
import { AdminSettingsInterface } from './interfaces/admin-settings.interface';
import { ADMIN_USER_CRUD_SERVICE_TOKEN, UserProfileCrudService } from '../../rockets-server.constants';
import { RocketsServerUserDto } from '../../dto/user/rockets-server-user.dto';
import { AdminUserCreateDto } from './admin-user-create.dto';
import { AdminUserUpdateDto } from './admin-user-update.dto';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
import { AdminGuard } from '../../guards/admin.guard';
import { UserProfileEntityInterface } from '@concepta/nestjs-common';

const RAW_OPTIONS_TOKEN = Symbol('__ROCKETS_SERVER_ADMIN_MODULE_RAW_OPTIONS_TOKEN__');

export const {
  ConfigurableModuleClass: RocketsServerAdminModuleClass,
  OPTIONS_TYPE: ROCKETS_SERVER_ADMIN_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ROCKETS_SERVER_ADMIN_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<AdminOptionsInterface>({
  moduleName: 'RocketsServerAdmin',
  optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
  .setExtras<AdminOptionsExtrasInterface>({
    // Provide dummy defaults to satisfy typing; actual values come at register time
    adapter: class {} as any,
  }, definitionTransform)
  .build();

export type RocketsServerAdminOptions = Omit<
  typeof ROCKETS_SERVER_ADMIN_OPTIONS_TYPE,
  'global'
>;

export type RocketsServerAdminAsyncOptions = Omit<
  typeof ROCKETS_SERVER_ADMIN_ASYNC_OPTIONS_TYPE,
  'global'
>;

function definitionTransform(
  definition: DynamicModule,
  extras: AdminOptionsExtrasInterface,
): DynamicModule {
  const { imports = [], providers = [], controllers = [] } = definition;
  

  const adminProviders = createAdminProviders(extras);
  const adminControllers = createAdminControllers(extras);

  return {
    ...definition,
    imports: [...imports, ...((extras.imports as any) || [])],
    providers: [...providers, ...adminProviders],
    controllers: [...controllers, ...adminControllers],
    exports: createAdminExports(),
  };
}

function createAdminProviders(extras: AdminOptionsExtrasInterface): Provider[] {
  const providers: Provider[] = [];

  const userCrud = buildUserCrud(extras);
  providers.push(
    extras.adapter,
    userCrud.ConfigurableServiceClass,
    {
      provide: ADMIN_USER_CRUD_SERVICE_TOKEN,
      useClass: userCrud.ConfigurableServiceClass,
    },
  );

  if (extras.profile?.adapter) {
    const profileCrud = buildProfileCrud(extras);
    providers.push(
      extras.profile.adapter,
      profileCrud.ConfigurableServiceClass,
      { provide: UserProfileCrudService, useClass: profileCrud.ConfigurableServiceClass },
    );

    // Override admin service class to orchestrate profile ops
    class AdminUserCrudServiceExt extends userCrud.ConfigurableServiceClass {
      constructor(
        @Inject(extras.adapter) crudAdapter: any,
        @Inject(UserProfileCrudService) private readonly profileCrudService: any,
      ) {
        super(crudAdapter);
      }

      async updateOne(crudRequest: any, dto: any) {
        const { profile, ...userDto } = dto || {};
        const user = await super.updateOne(crudRequest, userDto);
        if (profile) {
          const existing = await this.profileCrudService.getMany({
            ...crudRequest,
            parsed: {
              ...crudRequest.parsed,
              filter: [
                { field: 'userId', operator: '$eq', value: (user as any).id },
              ],
            },
          });
          const current = Array.isArray(existing)
            ? existing[0]
            : (existing as any)?.data?.[0];
          if (current) {
            await this.profileCrudService.updateOne(crudRequest, {
              ...current,
              ...profile,
            });
          } else {
            await this.profileCrudService.createOne(crudRequest, {
              ...profile,
              userId: (user as any).id,
            });
          }
        }
        const merged = await this.profileCrudService.getMany({
          ...crudRequest,
          parsed: {
            ...crudRequest.parsed,
            filter: [
              { field: 'userId', operator: '$eq', value: (user as any).id },
            ],
          },
        });
        const mergedProfile = Array.isArray(merged)
          ? merged[0]
          : (merged as any)?.data?.[0];
        return { ...user, profile: mergedProfile || undefined };
      }

      async getOne(crudRequest: any) {
        const user = await super.getOne(crudRequest);
        if (!(user as any)?.id) return user;
        const profileRes = await this.profileCrudService.getMany({
          ...crudRequest,
          parsed: {
            ...crudRequest.parsed,
            filter: [
              { field: 'userId', operator: '$eq', value: (user as any).id },
            ],
          },
        });
        const profile = Array.isArray(profileRes)
          ? profileRes[0]
          : (profileRes as any)?.data?.[0];
        return { ...(user as any), profile: profile || undefined };
      }

      async getMany(crudRequest: any) {
        const result = await super.getMany(crudRequest);
        const users = Array.isArray(result) ? result : (result as any)?.data || [];
        const userIds = users.map((u: any) => u.id);
        let profiles: any[] = [];
        if (userIds.length > 0) {
          const profileRes = await this.profileCrudService.getMany({
            ...crudRequest,
            parsed: {
              ...crudRequest.parsed,
              filter: [{ field: 'userId', operator: '$in', value: userIds }],
            },
          });
          profiles = Array.isArray(profileRes)
            ? profileRes
            : ((profileRes as any)?.data as any[]) || [];
        }
        const idToProfile = new Map(profiles.map((p: any) => [p.userId, p]));
        const mapUser = (u: any) => ({ ...u, profile: idToProfile.get(u.id) || undefined });
        if (Array.isArray(result)) {
          return users.map(mapUser);
        }
        return { ...(result as any), data: users.map(mapUser) };
      }
    }

    providers.push({
      provide: ADMIN_USER_CRUD_SERVICE_TOKEN,
      useClass: AdminUserCrudServiceExt,
    });
  }

  return providers;
}

function createAdminControllers(extras: AdminOptionsExtrasInterface): NonNullable<DynamicModule['controllers']> {
  const controllers: NonNullable<DynamicModule['controllers']> = [];
  const {
    ConfigurableControllerClass,
    CrudController,
    CrudGetMany,
    CrudGetOne,
    CrudCreateMany,
    CrudCreateOne,
    CrudUpdateOne,
    CrudReplaceOne,
    CrudDeleteOne,
    CrudRecoverOne,
  } = buildUserCrud(extras);

  @CrudController
  class AdminUserCrudController extends ConfigurableControllerClass {
    constructor(
      @Inject(ADMIN_USER_CRUD_SERVICE_TOKEN) crudService: any,
      @Inject(UserProfileCrudService)
      private readonly profileCrudService: CrudService<UserProfileEntityInterface>,
    ) {
      super(crudService);
    }

    @CrudGetMany
    async getMany(crudRequest: CrudRequestInterface<RocketsServerUserEntityInterface>) {
      const result = await super.getMany(crudRequest);

      const users = Array.isArray(result) ? result : result?.data || [];
      const userIds = users.map((u: RocketsServerUserEntityInterface) => u.id);
      let profiles: any[] = [];
      if (userIds.length > 0) {
        const profileRes = await this.profileCrudService.getMany({
          ...crudRequest,
          parsed: {
            filter: [{ field: 'userId', operator: '$in', value: userIds }],
          },
        });
        profiles = Array.isArray(profileRes)
          ? profileRes
          : ((profileRes as any)?.data as any[]) || [];
      }
      const idToProfile = new Map(profiles.map((p: any) => [p.userId, p]));
      const mapUser = (u: any) => ({ ...u, profile: idToProfile.get(u.id) || undefined });
      if (Array.isArray(result)) {
        return users.map(mapUser);
      }
      return { ...(result as any), data: users.map(mapUser) };
    }

    @CrudGetOne
    async getOne(crudRequest: CrudRequestInterface<RocketsServerUserEntityInterface>) {
      const user = (await super.getOne(crudRequest)) as any;
      if (!user?.id) return user;
      const profileRes = await this.profileCrudService.getMany({
        ...crudRequest,
        parsed: {
          ...crudRequest.parsed,
          filter: [{ field: 'userId' as any, operator: '$eq', value: user.id }],
        },
      } as any);
      const profile = Array.isArray(profileRes) ? profileRes[0] : (profileRes as any)?.data?.[0];
      return { ...user, profile: profile || undefined };
    }

    @CrudUpdateOne
    async updateOne(
      crudRequest: CrudRequestInterface<RocketsServerUserEntityInterface>,
      dto: AdminUserUpdateDto,
    ) {
      const { profile, ...userDto } = dto || ({} as any);
      const user = (await super.updateOne(crudRequest, userDto)) as any;
      if (profile) {
        const existing = await this.profileCrudService.getMany({
          ...crudRequest,
          parsed: {
            ...crudRequest.parsed,
            filter: [
              { field: 'userId' as any, operator: '$eq', value: user.id },
            ],
          },
        } as any);
        const current = Array.isArray(existing) ? existing[0] : (existing as any)?.data?.[0];
        if (current) {
          await this.profileCrudService.updateOne(crudRequest, {
            ...current,
            ...profile,
          });
        } else {
          await this.profileCrudService.createOne(crudRequest, {
            ...profile,
            userId: user.id,
          });
        }
      }
      const merged = await this.profileCrudService.getMany({
        ...crudRequest,
        parsed: {
          ...crudRequest.parsed,
          filter: [{ field: 'userId' as any, operator: '$eq', value: user.id }],
        },
      } as any);
      const mergedProfile = Array.isArray(merged) ? merged[0] : (merged as any)?.data?.[0];
      return { ...user, profile: mergedProfile || undefined };
    }
  }

  controllers.push(AdminUserCrudController);
  return controllers;
}

function createAdminExports(options?: { exports: DynamicModule['exports'] }): DynamicModule['exports'] {
  return [ADMIN_USER_CRUD_SERVICE_TOKEN];
}

function buildUserCrud(extras: AdminOptionsExtrasInterface) {
  const builder = new ConfigurableCrudBuilder({
    service: {
      adapter: extras.adapter,
      injectionToken: ADMIN_USER_CRUD_SERVICE_TOKEN,
    },
    controller: {
      path: extras.path || 'admin/users',
      model: { type: extras.model || RocketsServerUserDto },
      extraDecorators: [ApiTags('admin'), UseGuards(AdminGuard), ApiBearerAuth()],
    },
    getMany: {},
    getOne: {},
    createOne: { dto: extras.dto?.createOne || AdminUserCreateDto },
    createMany: { dto: extras.dto?.createMany || AdminUserCreateDto },
    updateOne: { dto: extras.dto?.updateOne || AdminUserUpdateDto },
    replaceOne: { dto: extras.dto?.replaceOne || AdminUserCreateDto },
    deleteOne: {},
  });
  return builder.build();
}

function buildProfileCrud(extras: AdminOptionsExtrasInterface) {
  const builder = new ConfigurableCrudBuilder({
    service: {
      adapter: extras.profile!.adapter,
      injectionToken: UserProfileCrudService,
    },
    controller: {
      path: '__admin_profile_hidden__',
      model: { type: class {} },
      extraDecorators: [],
    },
    getMany: {},
    getOne: {},
    createOne: { dto: extras.profile?.dto?.createOne },
    createMany: { dto: extras.profile?.dto?.createMany },
    updateOne: { dto: extras.profile?.dto?.updateOne },
    replaceOne: { dto: extras.profile?.dto?.replaceOne },
    deleteOne: {},
  });
  return builder.build();
}


