import {
  ConfigurableCrudBuilder,
  CrudRequestInterface,
  CrudResponsePaginatedDto,
} from '@concepta/nestjs-crud';
import {
  DynamicModule,
  Module,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RocketsAuthUserUpdateDto } from '../dto/rockets-auth-user-update.dto';
import { RocketsAuthUserDto } from '../dto/rockets-auth-user.dto';
import { AdminGuard } from '../../../guards/admin.guard';
import { UserCrudOptionsExtrasInterface } from '../../../shared/interfaces/rockets-auth-options-extras.interface';
import { ADMIN_USER_CRUD_SERVICE_TOKEN } from '../../../shared/constants/rockets-auth.constants';

import { Exclude, Expose, Type } from 'class-transformer';
import { RocketsAuthUserCreatableInterface } from '../interfaces/rockets-auth-user-creatable.interface';
import { RocketsAuthUserEntityInterface } from '../interfaces/rockets-auth-user-entity.interface';
import { RocketsAuthUserUpdatableInterface } from '../interfaces/rockets-auth-user-updatable.interface';
import { RocketsAuthUserInterface } from '../interfaces/rockets-auth-user.interface';
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
        ],
      },
      getMany: {},
      getOne: {},
      updateOne: {
        dto: UpdateDto,
      },
    });

    const {
      ConfigurableControllerClass,
      ConfigurableServiceClass,
      CrudUpdateOne,
    } = builder.build();

    class AdminUserCrudService extends ConfigurableServiceClass {}
    // TODO: add decorators and option to overwrite or disable controller
    class AdminUserCrudController extends ConfigurableControllerClass {
      /**
       * Override updateOne to automatically use authenticated user's ID
       */
      @CrudUpdateOne
      @ApiOperation({
        summary: 'Update current user userMetadata',
        description:
          'Updates the currently authenticated user userMetadata information',
      })
      @ApiBody({
        type: UpdateDto,
        description: 'User userMetadata information to update',
      })
      @ApiOkResponse({
        description: 'User userMetadata updated successfully',
        type: ModelDto,
      })
      @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
      })
      @ApiResponse({
        status: 401,
        description: 'Unauthorized - User not authenticated',
      })
      async updateOne(
        crudRequest: CrudRequestInterface<RocketsAuthUserEntityInterface>,
        updateDto: InstanceType<typeof UpdateDto>,
      ) {
        const pipe = new ValidationPipe({
          transform: true,
          skipMissingProperties: true,
          forbidUnknownValues: true,
        });
        await pipe.transform(updateDto, { type: 'body', metatype: UpdateDto });

        return super.updateOne(crudRequest, updateDto);
      }
    }

    return {
      module: RocketsAuthAdminModule,
      imports: [...(admin.imports || [])],
      controllers: [AdminUserCrudController],
      providers: [
        admin.adapter,
        AdminUserCrudService,
        {
          provide: ADMIN_USER_CRUD_SERVICE_TOKEN,
          useClass: AdminUserCrudService,
        },
      ],
      exports: [AdminUserCrudService, admin.adapter],
    };
  }
}
