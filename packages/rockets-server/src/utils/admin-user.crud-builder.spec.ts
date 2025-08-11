import { Test, TestingModule } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CrudModule, TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { Entity, Repository } from 'typeorm';

import { AdminUserCrudBuilder } from './admin-user.crud-builder';
import { RocketsServerUserDto } from '../dto/user/rockets-server-user.dto';
import { RocketsServerUserCreateDto } from '../dto/user/rockets-server-user-create.dto';
import { RocketsServerUserUpdateDto } from '../dto/user/rockets-server-user-update.dto';
import { ADMIN_USER_CRUD_SERVICE_TOKEN } from '../rockets-server.constants';
import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { RocketsServerUserEntityInterface } from '../interfaces/user/rockets-server-user-entity.interface';
import { TokenCrudAdapter } from '../controllers/admin/token-crud.adapter';

@Entity()
class UserFixture extends UserSqliteEntity {
  
}

class AdminUserTypeOrmCrudAdapter extends TypeOrmCrudAdapter<RocketsServerUserEntityInterface> {
  constructor(
    @InjectRepository(UserFixture)
    private readonly repository: Repository<RocketsServerUserEntityInterface>,
  ) {
    super(repository);
  }
} 

describe('AdminUserCrudBuilder', () => {

  it('should create a module with controller and service, and verify crudAdapter property', async () => {
    type AdminUserExtras = {
      model: {
        type: typeof RocketsServerUserDto;
      };
      createOne: {
        dto: typeof RocketsServerUserCreateDto;
      };
      updateOne: {
        dto: typeof RocketsServerUserUpdateDto;
      };
    };

    const extras: AdminUserExtras = {
      model: {
        type: RocketsServerUserDto,
      },
      createOne: {
        dto: RocketsServerUserCreateDto,
      },
      updateOne: {
        dto: RocketsServerUserUpdateDto,
      },
    };

    const builder = new AdminUserCrudBuilder<
      UserFixture,
      RocketsServerUserCreateDto,
      RocketsServerUserUpdateDto,
      RocketsServerUserCreateDto,
      AdminUserExtras
    >();

    // const optionsTransform = (options: any, extras?: AdminUserExtras) => {
    //   if (!extras) return options;
    //   options.controller.model.type = extras.model.type;
    //   options.service.adapter = AdminUserTypeOrmCrudAdapter;
    //   if (options.createOne) options.createOne.dto = extras.createOne.dto;
    //   if (options.updateOne) options.updateOne.dto = extras.updateOne.dto;
    //   return options;
    // };

    // builder.setExtras(extras, optionsTransform);

    const { ConfigurableControllerClass, ConfigurableServiceProvider } = builder.build();

    
    // Create a test module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [
            UserFixture,
          ],
        }),
        TypeOrmModule.forFeature([UserFixture]),
        CrudModule.forRoot({}),
      ],
      providers: [
        {
          provide: TokenCrudAdapter,
          useClass: AdminUserTypeOrmCrudAdapter,
        },
        ConfigurableServiceProvider,
      ],
      controllers: [ConfigurableControllerClass],
    }).compile();

    // Get the service instance
    const service = module.get(ADMIN_USER_CRUD_SERVICE_TOKEN);
    
    // Verify the service has the crudAdapter property
    expect(service).toBeDefined();
    expect(service.crudAdapter).toBeDefined();
    
    // Verify the crudAdapter is an instance of AdminUserTypeOrmCrudAdapter
    expect(service.crudAdapter).toBeInstanceOf(AdminUserTypeOrmCrudAdapter);
    
    // Verify the controller is also available
    const controller = module.get(ConfigurableControllerClass);
    expect(controller).toBeDefined();
  });
}); 