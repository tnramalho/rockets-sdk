import {
  ConfigurableCrudBuilder,
  CrudRequestInterface,
  CrudResponsePaginatedDto,
  CrudRelationRegistry,
  CrudService,
  CrudAdapter,
} from '@concepta/nestjs-crud';
import {
  DynamicModule,
  Module,
  UseGuards,
  ValidationPipe,
  applyDecorators,
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RocketsAuthUserUpdateDto } from '../dto/rockets-auth-user-update.dto';
import { RocketsAuthUserDto } from '../dto/rockets-auth-user.dto';
import { AdminGuard } from '../../../guards/admin.guard';
import { UserCrudOptionsExtrasInterface } from '../../../shared/interfaces/rockets-auth-options-extras.interface';
import {
  ADMIN_USER_CRUD_SERVICE_TOKEN,
  ROCKETS_ADMIN_USER_METADATA_ADAPTER,
  ROCKETS_ADMIN_USER_RELATION_REGISTRY,
} from '../../../shared/constants/rockets-auth.constants';

import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { RocketsAuthUserCreatableInterface } from '../interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserEntityInterface } from '../interfaces/rockets-auth-user-entity.interface';
import { RocketsAuthUserUpdatableInterface } from '../interfaces/rockets-auth-user-updatable.interface';
import { RocketsAuthUserMetadataEntityInterface } from '../interfaces/rockets-auth-user-metadata-entity.interface';
import { RocketsAuthUserInterface } from '../interfaces/rockets-auth-user.interface';
import { GenericUserMetadataModelService } from '../services/rockets-auth-user-metadata.model.service';
import { RocketsAuthUserMetadataDto } from '../dto/rockets-auth-user-metadata.dto';
import {
  RepositoryInterface,
  getDynamicRepositoryToken,
} from '@concepta/nestjs-common';
import {
  AUTH_USER_METADATA_MODULE_ENTITY_KEY,
  AuthUserMetadataModelService,
} from '../constants/user-metadata.constants';
import { CrudApiParam } from '@concepta/nestjs-crud/dist/crud/decorators/openapi/crud-api-param.decorator';
import { CrudRelations } from '@concepta/nestjs-crud/dist/crud/decorators/routes/crud-relations.decorator';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';

@Module({})
export class RocketsAuthAdminModule {
  static register(admin: UserCrudOptionsExtrasInterface): DynamicModule {
    const ModelDto = admin.model || RocketsAuthUserDto;
    const UpdateDto = admin.dto?.updateOne || RocketsAuthUserUpdateDto;
    @Exclude()
    class PaginatedDto extends CrudResponsePaginatedDto<RocketsAuthUserInterface> {
      @Expose()
      @ApiProperty({
        type: ModelDto,
        isArray: true,
        description: 'Array of Orgs',
      })
      @Type(() => ModelDto)
      data: RocketsAuthUserInterface[] = [];
    }

    // Service for hydrating user metadata (relation target)
    // This service is used by the CrudRelations system to fetch related metadata
    @Injectable()
    class UserMetadataCrudService extends CrudService<RocketsAuthUserMetadataEntityInterface> {
      constructor(
        @Inject(ROCKETS_ADMIN_USER_METADATA_ADAPTER)
        metadataAdapter: CrudAdapter<RocketsAuthUserMetadataEntityInterface>,
      ) {
        super(metadataAdapter);
      }
    }

    const builder = new ConfigurableCrudBuilder<
      RocketsAuthUserEntityInterface,
      RocketsAuthUserCreatableInterface,
      RocketsAuthUserUpdatableInterface
    >({
      service: {
        adapter: admin.adapter,
        injectionToken: ADMIN_USER_CRUD_SERVICE_TOKEN,
      },
      controller: {
        path: admin.path || 'admin/users',
        model: {
          type: ModelDto,
          paginatedType: PaginatedDto,
        },
        extraDecorators: [
          ApiTags('admin'),
          UseGuards(AdminGuard),
          ApiBearerAuth(),
          CrudRelations<
            RocketsAuthUserEntityInterface,
            [RocketsAuthUserMetadataEntityInterface]
          >({
            rootKey: 'id',
            relations: [
              {
                join: 'LEFT',
                cardinality: 'one',
                service: UserMetadataCrudService,
                property: 'userMetadata',
                primaryKey: 'id',
                foreignKey: 'userId',
              },
            ],
          }),
        ],
      },
      getMany: {},
      getOne: {},
      updateOne: {
        dto: UpdateDto,
        extraDecorators: [
          applyDecorators(
            CrudApiParam({
              name: 'id',
              required: true,
              description: 'User id',
            }),
          ),
        ],
      },
    });

    const { ConfigurableControllerClass } = builder.build();

    // Relation-aware Admin User CrudService that extends CrudService directly
    // with proper generic types for relations
    // CrudRelations handles metadata queries, but create/update require manual handling
    class AdminUserCrudService extends CrudService<
      RocketsAuthUserEntityInterface,
      [RocketsAuthUserMetadataEntityInterface]
    > {
      constructor(
        @Inject(admin.adapter)
        protected readonly crudAdapter: CrudAdapter<RocketsAuthUserEntityInterface>,
        @Inject(forwardRef(() => ROCKETS_ADMIN_USER_RELATION_REGISTRY))
        protected readonly relationRegistry: CrudRelationRegistry<
          RocketsAuthUserEntityInterface,
          [RocketsAuthUserMetadataEntityInterface]
        >,
        @Inject(AuthUserMetadataModelService)
        private readonly userMetadataService: GenericUserMetadataModelService,
      ) {
        super(crudAdapter, relationRegistry);
      }

      async updateOne(
        req: CrudRequestInterface<RocketsAuthUserEntityInterface>,
        dto:
          | RocketsAuthUserEntityInterface
          | Partial<RocketsAuthUserEntityInterface>,
      ): Promise<RocketsAuthUserEntityInterface> {
        // Extract userMetadata from DTO if present
        const { userMetadata, ...userDto } = dto;

        // Validate metadata if provided
        if (userMetadata && Object.keys(userMetadata).length > 0) {
          const MetadataDto = admin.userMetadataConfig.updateDto;
          const metadataInstance = plainToInstance(MetadataDto, userMetadata);

          const pipe = new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            forbidUnknownValues: true,
          });

          try {
            await pipe.transform(metadataInstance, {
              type: 'body',
              metatype: MetadataDto,
            });
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : 'Invalid metadata';
            throw new BadRequestException(message);
          }
        }

        // Update user fields first (excluding metadata)
        const result = await super.updateOne(req, userDto);

        // Manually create/update metadata using userMetadataService
        if (userMetadata) {
          try {
            await this.userMetadataService.createOrUpdate(
              result.id,
              userMetadata,
            );
          } catch (metadataError) {
            // Don't fail the entire update if metadata fails
          }
        }

        // CrudRelations will fetch the complete user with metadata
        const updatedUser = await super.getOne(req);
        return updatedUser;
      }
    }

    // Controller extends ConfigurableControllerClass and delegates to service
    class AdminUserCrudController extends ConfigurableControllerClass {}

    return {
      module: RocketsAuthAdminModule,
      imports: [
        ...(admin.imports || []),
        // Register the metadata entity with TypeOrmExtModule for dynamic repository injection if provided
        ...(admin.userMetadataConfig.entity
          ? [
              TypeOrmExtModule.forFeature({
                [AUTH_USER_METADATA_MODULE_ENTITY_KEY]: {
                  entity: admin.userMetadataConfig.entity,
                },
              }),
            ]
          : []),
      ],
      controllers: [AdminUserCrudController],
      providers: [
        admin.adapter,
        // Provide metadata adapter for relations system
        admin.userMetadataConfig.adapter,
        {
          provide: ROCKETS_ADMIN_USER_METADATA_ADAPTER,
          useExisting: admin.userMetadataConfig.adapter,
        },
        // Provide the UserMetadataModelService for manual create/update operations
        {
          provide: AuthUserMetadataModelService,
          useFactory: (
            repo: RepositoryInterface<RocketsAuthUserMetadataEntityInterface>,
          ) => {
            // Get DTOs from config, or use default base DTO
            const { createDto, updateDto } = admin.userMetadataConfig || {
              createDto: RocketsAuthUserMetadataDto,
              updateDto: RocketsAuthUserMetadataDto,
            };
            return new GenericUserMetadataModelService(
              repo,
              createDto,
              updateDto,
            );
          },
          inject: [
            getDynamicRepositoryToken(AUTH_USER_METADATA_MODULE_ENTITY_KEY),
          ],
        },
        UserMetadataCrudService,
        {
          provide: ROCKETS_ADMIN_USER_RELATION_REGISTRY,
          inject: [UserMetadataCrudService],
          useFactory: (userMetadataCrudService: UserMetadataCrudService) => {
            const registry = new CrudRelationRegistry<
              RocketsAuthUserEntityInterface,
              [RocketsAuthUserMetadataEntityInterface]
            >();
            registry.register(userMetadataCrudService);
            return registry;
          },
        },
        AdminUserCrudService,
        {
          provide: ADMIN_USER_CRUD_SERVICE_TOKEN,
          useClass: AdminUserCrudService,
        },
      ],
      exports: [
        AdminUserCrudService,
        admin.adapter,
        admin.userMetadataConfig.adapter,
      ],
    };
  }
}
