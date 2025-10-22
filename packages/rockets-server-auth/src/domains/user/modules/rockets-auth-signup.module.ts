import {
  PasswordPlainInterface,
  UserCreatableInterface,
} from '@concepta/nestjs-common';
import {
  ConfigurableCrudBuilder,
  CrudAdapter,
  CrudRequestInterface,
  CrudService,
  CrudRelationRegistry,
} from '@concepta/nestjs-crud';
import { PasswordCreationService } from '@concepta/nestjs-password';
import {
  BadRequestException,
  DynamicModule,
  Inject,
  Module,
  ValidationPipe,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  SIGNUP_USER_CRUD_SERVICE_TOKEN,
  ROCKETS_SIGNUP_USER_METADATA_ADAPTER,
  ROCKETS_SIGNUP_USER_RELATION_REGISTRY,
  ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
} from '../../../shared/constants/rockets-auth.constants';
import { UserCrudOptionsExtrasInterface } from '../../../shared/interfaces/rockets-auth-options-extras.interface';
import { RocketsAuthUserCreateDto } from '../dto/rockets-auth-user-create.dto';
import { RocketsAuthUserDto } from '../dto/rockets-auth-user.dto';
import { getErrorDetails } from '../../../shared/utils/error-logging.helper';
import { CrudRelations } from '@concepta/nestjs-crud/dist/crud/decorators/routes/crud-relations.decorator';

import { AuthPublic } from '@concepta/nestjs-authentication';
import {
  RepositoryInterface,
  getDynamicRepositoryToken,
} from '@concepta/nestjs-common';
import { UserModelService } from '@concepta/nestjs-user';
import {
  AuthUserMetadataModelService,
  AUTH_USER_METADATA_MODULE_ENTITY_KEY,
} from '../constants/user-metadata.constants';
import { RocketsAuthUserMetadataDto } from '../dto/rockets-auth-user-metadata.dto';
import { RocketsAuthUserCreatableInterface } from '../interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserEntityInterface } from '../interfaces/rockets-auth-user-entity.interface';
import { RocketsAuthUserMetadataEntityInterface } from '../interfaces/rockets-auth-user-metadata-entity.interface';
import { GenericUserMetadataModelService } from '../services/rockets-auth-user-metadata.model.service';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { RoleModelService, RoleService } from '@concepta/nestjs-role';
import { RocketsAuthSettingsInterface } from '../../../shared/interfaces/rockets-auth-settings.interface';

@Module({})
export class RocketsAuthSignUpModule {
  static register(admin: UserCrudOptionsExtrasInterface): DynamicModule {
    const ModelDto = admin.model || RocketsAuthUserDto;
    const CreateDto = admin.dto?.createOne || RocketsAuthUserCreateDto;

    // Service for hydrating user metadata (relation target)
    // This service is used by the CrudRelations system to fetch related metadata
    @Injectable()
    class UserMetadataCrudService extends CrudService<RocketsAuthUserMetadataEntityInterface> {
      constructor(
        @Inject(ROCKETS_SIGNUP_USER_METADATA_ADAPTER)
        metadataAdapter: CrudAdapter<RocketsAuthUserMetadataEntityInterface>,
      ) {
        super(metadataAdapter);
      }
    }

    const builder = new ConfigurableCrudBuilder<
      RocketsAuthUserEntityInterface,
      RocketsAuthUserCreatableInterface,
      RocketsAuthUserCreatableInterface
    >({
      service: {
        adapter: admin.adapter,
        injectionToken: SIGNUP_USER_CRUD_SERVICE_TOKEN,
      },
      controller: {
        path: admin.path || 'signup',
        model: {
          type: ModelDto,
        },
        extraDecorators: [
          ApiTags('auth'),
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
      createOne: {
        dto: CreateDto,
      },
    });

    const { ConfigurableControllerClass, CrudCreateOne } = builder.build();

    class SignupCrudService extends CrudService<
      RocketsAuthUserEntityInterface,
      [RocketsAuthUserMetadataEntityInterface]
    > {
      constructor(
        @Inject(admin.adapter)
        protected readonly crudAdapter: CrudAdapter<RocketsAuthUserEntityInterface>,
        @Inject(forwardRef(() => ROCKETS_SIGNUP_USER_RELATION_REGISTRY))
        protected readonly relationRegistry: CrudRelationRegistry<
          RocketsAuthUserEntityInterface,
          [RocketsAuthUserMetadataEntityInterface]
        >,
        @Inject(UserModelService)
        private readonly userModelService: UserModelService,
        @Inject(PasswordCreationService)
        private readonly passwordCreationService: PasswordCreationService,
        @Inject(AuthUserMetadataModelService)
        private readonly metadataService: GenericUserMetadataModelService,
        @Inject(RoleModelService)
        private readonly roleModelService: RoleModelService,
        @Inject(RoleService)
        private readonly roleService: RoleService,
        @Inject(ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN)
        private readonly settings: RocketsAuthSettingsInterface,
      ) {
        super(crudAdapter, relationRegistry);
      }

      async createOne(
        req: CrudRequestInterface<RocketsAuthUserEntityInterface>,
        dto: RocketsAuthUserEntityInterface & PasswordPlainInterface,
      ): Promise<RocketsAuthUserEntityInterface> {
        const typedDto = dto;

        // Check if user already exists
        if (typedDto.username || typedDto.email) {
          const existingUser = await this.userModelService.find({
            where: [
              ...(typedDto.username ? [{ username: typedDto.username }] : []),
              ...(typedDto.email ? [{ email: typedDto.email }] : []),
            ],
          });

          if (existingUser?.length) {
            throw new BadRequestException(
              'User with this username or email already exists',
            );
          }
        }

        // Hash password if provided
        let passwordHash = {};
        if (typedDto.password) {
          passwordHash = await this.passwordCreationService.create(
            typedDto.password,
          );
        }

        // Extract nested metadata if present
        const { userMetadata: nested, ...rootDto } = typedDto;

        // Create user without metadata
        const created = await super.createOne(req, {
          ...rootDto,
          ...passwordHash,
        });

        // Manually create metadata if provided using userMetadataService
        if (nested) {
          try {
            await this.metadataService.createOrUpdate(
              created.id,
              nested as Record<string, unknown>,
            );
          } catch (metadataError) {
            // Log error but don't fail signup if metadata creation fails
            console.warn(
              'Failed to create user metadata during signup:',
              metadataError,
            );
          }
        }

        // Assign default role if configured
        if (this.settings.role.defaultUserRoleName) {
          try {
            const defaultRoles = await this.roleModelService.find({
              where: { name: this.settings.role.defaultUserRoleName },
            });

            if (defaultRoles && defaultRoles.length > 0) {
              await this.roleService.assignRole({
                assignment: 'user',
                assignee: { id: created.id },
                role: { id: defaultRoles[0].id },
              });
            }
          } catch (error) {
            // Log but don't fail signup if role assignment fails
            const { errorMessage } = getErrorDetails(error);
            console.warn(`Failed to assign default role: ${errorMessage}`);
          }
        }

        return created;
      }
    }
    // TODO: add decorators and option to overwrite or disable controller
    class SignupCrudController extends ConfigurableControllerClass {
      @AuthPublic()
      @ApiOperation({
        summary: 'Create a new user account',
        description:
          'Registers a new user in the system with email, username, password and optional metadata',
      })
      @ApiBody({
        type: CreateDto,
        description: 'User registration information',
        examples: {
          standard: {
            value: {
              email: 'user@example.com',
              username: 'user@example.com',
              password: 'StrongP@ssw0rd',
              active: true,
            },
            summary: 'Standard user registration',
          },
          withMetadata: {
            value: {
              email: 'user@example.com',
              username: 'user@example.com',
              password: 'StrongP@ssw0rd',
              active: true,
              userMetadata: {
                firstName: 'John',
                lastName: 'Doe',
                phone: '+1234567890',
              },
            },
            summary: 'User registration with metadata',
          },
        },
      })
      @ApiCreatedResponse({
        description: 'User created successfully',
        type: ModelDto,
      })
      @CrudCreateOne
      async createOne(
        crudRequest: CrudRequestInterface<UserCreatableInterface>,
        dto: InstanceType<typeof CreateDto>,
      ) {
        // Validate DTO
        const pipe = new ValidationPipe({
          transform: true,
          forbidUnknownValues: true,
        });
        await pipe.transform(dto, { type: 'body', metatype: CreateDto });

        // Delegate all business logic to service
        return await super.createOne(crudRequest, dto);
      }
    }

    return {
      module: RocketsAuthSignUpModule,
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
      controllers: [SignupCrudController],
      providers: [
        admin.adapter,
        // Provide metadata adapter for relations system
        admin.userMetadataConfig.adapter,
        {
          provide: ROCKETS_SIGNUP_USER_METADATA_ADAPTER,
          useExisting: admin.userMetadataConfig.adapter,
        },
        // Provide the UserMetadataModelService for manual create operations
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
          provide: ROCKETS_SIGNUP_USER_RELATION_REGISTRY,
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
        SignupCrudService,
        {
          provide: SIGNUP_USER_CRUD_SERVICE_TOKEN,
          useClass: SignupCrudService,
        },
      ],
      exports: [SignupCrudService, admin.adapter],
    };
  }
}
