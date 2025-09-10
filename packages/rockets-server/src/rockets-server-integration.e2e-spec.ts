import { VerifyTokenService } from '@concepta/nestjs-authentication';
import { EmailSendInterface } from '@concepta/nestjs-common';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

// RocketsServer imports
import { RocketsServerModule } from './rockets-server.module';

// RocketsServerAuth imports
import { RocketsServerAuthModule } from '@bitwild/rockets-server-auth';

// Entity fixtures from RocketsServer
import { FederatedEntityFixture } from './__fixtures__/federated/federated.entity.fixture';
import { RoleEntityFixture } from './__fixtures__/role/role.entity.fixture';
import { UserRoleEntityFixture } from './__fixtures__/role/user-role.entity.fixture';
import { UserOtpEntityFixture } from './__fixtures__/user/user-otp.entity.fixture';
import { UserPasswordHistoryEntityFixture } from './__fixtures__/user/user-password-history.entity.fixture';
import { UserProfileEntityFixture } from './__fixtures__/user/user-profile.entity.fixture';
import { UserEntityFixture } from './__fixtures__/user/user.entity.fixture';

// Auth provider fixture for RocketsServer that can validate JWT tokens
import { RocketsServerAuthJwtProviderFixture } from './__fixtures__/providers/rockets-server-auth-jwt.provider.fixture';

// Import required admin/CRUD components from RocketsServer
import { AdminUserTypeOrmCrudAdapter } from './__fixtures__/admin/admin-user-crud.adapter';
import { UserCreateDto } from './__fixtures__/dto/user-create.dto';
import { UserUpdateDto } from './__fixtures__/dto/user-update.dto';
import { UserDto } from './__fixtures__/dto/user.dto';

// Mock email service
const mockEmailService: EmailSendInterface = {
  sendMail: jest.fn().mockResolvedValue(undefined),
};

// Mock configuration module
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'jwt.secret') return 'test-secret-key';
          if (key === 'jwt.expiresIn') return '1h';
          return null;
        }),
      },
    },
  ],
  exports: [ConfigService],
})
class MockConfigModule {}

describe('RocketsServer + RocketsServerAuth Full Integration (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let testUser: any;

  // Test user credentials
  const userCredentials = {
    email: 'test@example.com',
    username: 'test@example.com',
    password: 'TestPassword123!',
    active: true,
  };

  // Database configuration with all required entities
  const dbConfig = {
    type: 'sqlite' as const,
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [
      UserEntityFixture,
      UserProfileEntityFixture,
      UserPasswordHistoryEntityFixture,
      UserOtpEntityFixture,
      FederatedEntityFixture,
      RoleEntityFixture,
      UserRoleEntityFixture,
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MockConfigModule,
        TypeOrmModule.forRoot(dbConfig),
        TypeOrmModule.forFeature([
          UserEntityFixture,
          UserProfileEntityFixture,
          UserOtpEntityFixture,
          FederatedEntityFixture,
          RoleEntityFixture,
          UserRoleEntityFixture,
        ]),
        RocketsServerAuthModule.forRootAsync({
          imports: [
            TypeOrmExtModule.forFeature({
              user: { entity: UserEntityFixture },
              userOtp: { entity: UserOtpEntityFixture },
              role: { entity: RoleEntityFixture },
              userRole: { entity: UserRoleEntityFixture },
              federated: { entity: FederatedEntityFixture },
            }),
          ],
          userCrud: {
            imports: [TypeOrmModule.forFeature([UserEntityFixture])],
            adapter: AdminUserTypeOrmCrudAdapter,
            model: UserDto,
            dto: {
              createOne: UserCreateDto,
              updateOne: UserUpdateDto,
            },
          },
          inject: [],
          useFactory: () => {
            return {
              services: {
                mailerService: mockEmailService
              },
            };
          },
        }),

        RocketsServerModule.forRootAsync({
          inject: [VerifyTokenService],
          useFactory: (VerifyTokenService: VerifyTokenService) => {
            return {
              settings: {},
              services: {
                authProvider: new RocketsServerAuthJwtProviderFixture(VerifyTokenService),
              },
            };
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    await app.init();
  });

  beforeAll(async () => {
    
    const signupData = {
      ...userCredentials,
    };

    // Signup new user
    const signupResponse = await request(app.getHttpServer())
      .post('/signup')
      .send(signupData)
      .expect(201);

    testUser = signupResponse.body;

    // Authenticate and get token
    const loginResponse = await request(app.getHttpServer())
      .post('/token/password')
      .send({
        username: userCredentials.email,
        password: userCredentials.password,
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('RocketsServerAuth Endpoints - Success Cases', () => {
    describe('Authentication Endpoints', () => {
      it('should authenticate with password successfully', async () => {
        // Already tested in beforeEach, but verify token structure
        expect(accessToken).toBeDefined();
        expect(typeof accessToken).toBe('string');
        expect(accessToken.length).toBeGreaterThan(0);
      });

      it('should refresh access token successfully', async () => {
        // Get refresh token first by logging in again
        const loginResponse = await request(app.getHttpServer())
          .post('/token/password')
          .send({
            username: userCredentials.email,
            password: userCredentials.password,
          })
          .expect(200);

        const refreshToken = loginResponse.body.refreshToken;

        // Use refresh token to get new access token
        const refreshResponse = await request(app.getHttpServer())
          .post('/token/refresh')
          .send({ refreshToken })
          .expect(200);

        expect(refreshResponse.body.accessToken).toBeDefined();
        //expect(refreshResponse.body.accessToken).not.toBe(accessToken);
      });

      it('should send OTP successfully', async () => {
        const otpResponse = await request(app.getHttpServer())
          .post('/otp')
          .send({ email: testUser.email })
          .expect(201);

        expect(otpResponse.body).toBeDefined();
      });
    });

    describe('Account Recovery Endpoints', () => {
      it('should request password recovery successfully', async () => {
        const recoveryResponse = await request(app.getHttpServer())
          .post('/recovery/password')
          .send({ email: testUser.email })
          .expect(201);

        expect(recoveryResponse.body).toBeDefined();
      });

      it('should recover login/username successfully', async () => {
        const recoveryResponse = await request(app.getHttpServer())
          .post('/recovery/login')
          .send({ email: testUser.email })
          .expect(201);

        expect(recoveryResponse.body).toBeDefined();
      });
    });

    describe('User Profile Endpoints', () => {
      it('should get current user profile successfully', async () => {
        const userResponse = await request(app.getHttpServer())
          .get('/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(userResponse.body.id).toBeDefined();
        expect(userResponse.body.email).toBe(testUser.email);
        expect(userResponse.body.username).toBe(testUser.username);
      });

      it('should update user profile successfully', async () => {
        const updateData = {
          firstName: 'Updated',
          lastName: 'User',
        };

        const updateResponse = await request(app.getHttpServer())
          .patch('/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateData)
          .expect(200);

        expect(updateResponse.body.firstName).toBe('Updated');
        expect(updateResponse.body.lastName).toBe('User');
      });
    });
  });

  describe('Authentication Flow Validation', () => {
    it('should maintain authentication across multiple requests', async () => {
      // Make multiple authenticated requests with same token
      for (let i = 0; i < 3; i++) {
        const response = await request(app.getHttpServer())
          .get('/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
        
        expect(response.body.id).toBe(testUser.id);
      }
    });

    it('should handle concurrent authenticated requests', async () => {
      // Make multiple concurrent requests
      const requests = Array(5).fill(null).map(() => 
        request(app.getHttpServer())
          .get('/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
      );

      const responses = await Promise.all(requests);
      
      // All responses should be successful and consistent
      responses.forEach(response => {
        expect(response.body.id).toBe(testUser.id);
        expect(response.body.email).toBe(testUser.email);
      });
    });
  });

  describe('Data Persistence Validation', () => {
    it('should persist user data modifications', async () => {
      const originalUser = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Update multiple fields
      const updateData = {
        firstName: 'Integration',
        lastName: 'Test',
      };

      await request(app.getHttpServer())
        .patch('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      // Verify persistence by getting user again
      const updatedUser = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(updatedUser.body.firstName).toBe('Integration');
      expect(updatedUser.body.lastName).toBe('Test');
      expect(updatedUser.body.id).toBe(originalUser.body.id);
      expect(updatedUser.body.email).toBe(originalUser.body.email);
    });

    it('should create unique users for each signup', async () => {
      // Create another user to verify uniqueness
      const newUserData = {
        email: `unique${Date.now()}@example.com`,
        username: `unique${Date.now()}`,
        password: 'TestPassword123!',
        active: true,
      };

      const newUserResponse = await request(app.getHttpServer())
        .post('/signup')
        .send(newUserData)
        .expect(201);

      expect(newUserResponse.body.id).not.toBe(testUser.id);
      expect(newUserResponse.body.email).toBe(newUserData.email);
      expect(newUserResponse.body.username).toBe(newUserData.username);
    });
  });

});