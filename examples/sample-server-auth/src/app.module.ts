import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import {
  RocketsServerAuthModule,
} from '@bitwild/rockets-server-auth';
import {
  RocketsServerModule,
} from '@bitwild/rockets-server';
import { DocumentBuilder } from '@nestjs/swagger';
import { ProfileEntity } from './modules/user/entities/profile.entity';
import { ProfileCreateDto, ProfileUpdateDto } from './modules/user/dto/profile.dto';


// Import modules
import { PetModule } from './modules/pet';
import { RocketsJwtAuthProvider, MockAuthProvider, UserModule } from './modules/user';

// Import user-related items
import {
  UserEntity,
  UserOtpEntity,
  RoleEntity,
  UserRoleEntity,
  FederatedEntity,
  UserDto,
  UserCreateDto,
  UserUpdateDto,
  UserTypeOrmCrudAdapter,
} from './modules/user';

// Import pet-related items
import { PetEntity } from './modules/pet';


@Module({
  imports: [
    // TypeORM configuration with SQLite in-memory
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        ProfileEntity, 
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
      profile: { entity: ProfileEntity },
      user: { entity: UserEntity },
      role: { entity: RoleEntity },
      userRole: { entity: UserRoleEntity },
      userOtp: { entity: UserOtpEntity },
      federated: { entity: FederatedEntity },
    }),
    
    RocketsServerAuthModule.forRootAsync({
      imports: [TypeOrmModule.forFeature([UserEntity])],
      
      useFactory: () => ({
        
        authJwt: {
          appGuard: false,
        },
        
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
        imports: [TypeOrmModule.forFeature([UserEntity])],
        adapter: UserTypeOrmCrudAdapter,
        model: UserDto,
        dto: {
          createOne: UserCreateDto,
          updateOne: UserUpdateDto,
        },
      },
    }),
    
    // RocketsServerModule for additional server features with JWT validation
    RocketsServerModule.forRoot({
      settings: {},
      enableGlobalGuard: true,
      authProvider: new MockAuthProvider(),
      profile: {
        createDto: ProfileCreateDto,
        updateDto: ProfileUpdateDto,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


