import {
  INestApplication,
  Controller,
  Get,
  Module,
  Global,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthUser } from '@concepta/nestjs-authentication';
import { AuthorizedUser } from '../../../interfaces/auth-user.interface';
import { UserUpdateDto } from '../../user/user.dto';
import { IsString, IsOptional } from 'class-validator';

import { ServerAuthProviderFixture } from '../../../__fixtures__/providers/server-auth.provider.fixture';
import { ProfileRepositoryFixture } from '../../../__fixtures__/repositories/profile.repository.fixture';
import { RocketsServerOptionsInterface } from '../../../interfaces/rockets-server-options.interface';
import { RocketsServerModule } from '../../../rockets-server.module';
import { getDynamicRepositoryToken } from '@concepta/nestjs-common';
import { PROFILE_MODULE_PROFILE_ENTITY_KEY } from '../constants/profile.constants';

// Custom DTOs for testing - extending base DTOs
import {
  BaseProfileCreateDto,
  BaseProfileUpdateDto,
  ProfileCreatableInterface,
  ProfileModelUpdatableInterface,
} from '../interfaces/profile.interface';

class TestProfileCreateDto
  extends BaseProfileCreateDto
  implements ProfileCreatableInterface
{
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  [key: string]: unknown;
}

class TestProfileUpdateDto
  extends BaseProfileUpdateDto
  implements ProfileModelUpdatableInterface
{
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  [key: string]: unknown;
}

// Test controller for profile testing
@ApiTags('profile-test')
@Controller('profile-test')
class ProfileTestController {
  @Get('protected')
  @ApiOkResponse({ description: 'Protected route response' })
  protectedRoute(@AuthUser() user: AuthorizedUser): {
    message: string;
    user: AuthorizedUser;
  } {
    return {
      message: 'This is a protected route',
      user,
    };
  }
}

@Global()
@Module({
  controllers: [ProfileTestController],
  providers: [
    {
      provide: getDynamicRepositoryToken(PROFILE_MODULE_PROFILE_ENTITY_KEY),
      inject: [],
      useFactory: () => {
        return new ProfileRepositoryFixture();
      },
    },
  ],
  exports: [
    {
      provide: getDynamicRepositoryToken(PROFILE_MODULE_PROFILE_ENTITY_KEY),
      inject: [],
      useFactory: () => {
        return new ProfileRepositoryFixture();
      },
    },
  ],
})
class ProfileTestModule {}

describe('RocketsServerModule - Profile Integration (e2e)', () => {
  let app: INestApplication;

  const baseOptions: RocketsServerOptionsInterface = {
    settings: {},
    authProvider: new ServerAuthProviderFixture(),
    profile: {
      createDto: TestProfileCreateDto,
      updateDto: TestProfileUpdateDto,
    },
  };

  afterEach(async () => {
    if (app) await app.close();
  });

  describe('Profile Functionality', () => {
    it('GET /user should return user data with profile when profile exists', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [ProfileTestModule, RocketsServerModule.forRoot(baseOptions)],
      }).compile();

      app = moduleRef.createNestApplication();
      await app.init();

      const res = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(res.body).toMatchObject({
        id: 'serverauth-user-1',
        sub: 'serverauth-user-1',
        email: 'serverauth@example.com',
        roles: ['admin'],
        profile: {
          id: 'profile-1',
          userId: 'serverauth-user-1',
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test user profile',
          location: 'Test City',
          dateCreated: expect.any(String),
          dateUpdated: expect.any(String),
        },
      });
    });

    it('PATCH /user should create new profile for user', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [ProfileTestModule, RocketsServerModule.forRoot(baseOptions)],
      }).compile();

      app = moduleRef.createNestApplication();
      await app.init();

      const updateData: UserUpdateDto = {
        profile: {
          firstName: 'Updated',
          lastName: 'Name',
          bio: 'Updated bio',
        },
      };

      const res = await request(app.getHttpServer())
        .patch('/user')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(200);

      expect(res.body).toMatchObject({
        id: 'serverauth-user-1',
        sub: 'serverauth-user-1',
        email: 'serverauth@example.com',
        roles: ['admin'],
        profile: {
          id: expect.any(String),
          userId: 'serverauth-user-1',
          firstName: 'Updated',
          lastName: 'Name',
          bio: 'Updated bio',
          dateCreated: expect.any(String),
          dateUpdated: expect.any(String),
        },
      });
    });

    it('should work with minimal profile configuration', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          RocketsServerModule.forRoot({
            settings: {},
            authProvider: new ServerAuthProviderFixture(),
            profile: {
              createDto: TestProfileCreateDto,
              updateDto: TestProfileUpdateDto,
            },
          }),
          ProfileTestModule,
        ],
      }).compile();

      app = moduleRef.createNestApplication();
      await app.init();

      const res = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(res.body).toMatchObject({
        id: 'serverauth-user-1',
        sub: 'serverauth-user-1',
        email: 'serverauth@example.com',
        roles: ['admin'],
        // Should not have profile fields when empty
      });
    });
  });
});
