import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import {
  RocketsAuthModule,
  RocketsJwtAuthProvider,
} from '@bitwild/rockets-server-auth';
import {
  RocketsModule,
} from '@bitwild/rockets-server';

import { UserMetadataEntity } from './modules/user/entities/user-metadata.entity';
import { UserMetadataCreateDto, UserMetadataUpdateDto } from './modules/user/dto/user-metadata.dto';

// Import modules
import { PetModule } from './modules/pet';
import { UserModule } from './modules/user';

// Import user-related items
import {
  UserEntity,
  UserOtpEntity,
  UserRoleEntity,
  FederatedEntity,
  UserDto,
  UserCreateDto,
  UserUpdateDto,
  UserTypeOrmCrudAdapter,
} from './modules/user';

// Import role-related items
import {
  RoleEntity,
  RoleDto,
  RoleUpdateDto,
  RoleTypeOrmCrudAdapter,
} from './modules/role';

// Import pet-related items
import { PetEntity } from './modules/pet';
import { RoleCreateDto } from './modules/role/role.dto';


@Module({
  imports: [
    // TypeORM configuration with SQLite in-memory
    TypeOrmExtModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        UserMetadataEntity, 
        PetEntity,
        UserEntity,
        UserOtpEntity,
        RoleEntity,
        UserRoleEntity,
        FederatedEntity
      ],
      synchronize: true,
      dropSchema: true,
    }),
    // Import domain modules
    PetModule,
    UserModule,
    TypeOrmExtModule.forFeature({
      userMetadata: { entity: UserMetadataEntity },
      user: { entity: UserEntity },
      role: { entity: RoleEntity },
      userRole: { entity: UserRoleEntity },
      userOtp: { entity: UserOtpEntity },
      federated: { entity: FederatedEntity },
    }), 
    
    RocketsAuthModule.forRootAsync({
      imports: [
        TypeOrmExtModule.forFeature({
          user: { entity: UserEntity },
        }), 
      ],
      
      enableGlobalJWTGuard: true,
      useFactory: () => ({
        
        // Services configuration (REQUIRED)
        services: {
          mailerService: {
            sendMail: async (options: any) => {
              console.log('📧 Email would be sent:', options.to);
              return Promise.resolve();
            },
          },
        },
      }),
      // Admin user CRUD functionality
      userCrud: {
        imports: [
          TypeOrmModule.forFeature([UserEntity])
        ],
        adapter: UserTypeOrmCrudAdapter,
        model: UserDto,
        dto: {
          createOne: UserCreateDto,
          updateOne: UserUpdateDto,
        },
      },
      // Admin role CRUD functionality
      roleCrud: {
        imports: [TypeOrmModule.forFeature([RoleEntity])],
        adapter: RoleTypeOrmCrudAdapter,
        model: RoleDto,
        dto: {
          createOne: RoleCreateDto,
          updateOne: RoleUpdateDto,
        },
      },
    }),
    
    // RocketsModule for additional server features with JWT validation
    RocketsModule.forRootAsync({
      imports: [
        TypeOrmExtModule.forFeature({
          user: { entity: UserEntity },
        }), 
      ],
      inject:[RocketsJwtAuthProvider],
      useFactory: (rocketsJwtAuthProvider: RocketsJwtAuthProvider) => ({
        settings: {},
        enableGlobalGuard: true,
        authProvider: rocketsJwtAuthProvider,
        userMetadata: {
          createDto: UserMetadataCreateDto,
          updateDto: UserMetadataUpdateDto,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}


