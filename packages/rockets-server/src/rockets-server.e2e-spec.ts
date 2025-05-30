import {
  INestApplication,
  Module,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { RocketsServerModule } from './rockets-server.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@concepta/nestjs-jwt';
import {
  AuthJwtGuard,
  AuthJwtVerifyTokenService,
} from '@concepta/nestjs-auth-jwt';
import { EmailSendInterface } from '@concepta/nestjs-common';
import { RocketsServerUserModelServiceInterface } from './interfaces/rockets-server-user-model-service.interface';
import { IssueTokenServiceFixture } from './__fixtures__/services/issue-token.service.fixture';
import { ValidateTokenServiceFixture } from './__fixtures__/services/validate-token.service.fixture';
import { ormConfig } from './__fixtures__/ormconfig.fixture';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserFixture } from './__fixtures__/user/user.entity.fixture';
import { UserOtpEntityFixture } from './__fixtures__/user/user-otp-entity.fixture';
import { VerifyTokenServiceInterface } from '@concepta/nestjs-authentication';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';

// Test controller with protected route
@Controller('test')
@ApiTags('test')
@UseGuards(AuthJwtGuard)
export class TestController {
  @Get('protected')
  @ApiOkResponse({
    description: 'Successfully accessed protected route',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async getProtected(): Promise<{ message: string }> {
    return { message: 'This is a protected route' };
  }
}

// Mock email service
const mockEmailService: EmailSendInterface = {
  sendMail: jest.fn().mockResolvedValue(undefined),
};

// Mock user mutate service
const mockUserModelService: RocketsServerUserModelServiceInterface = {
  update: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  create: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  replace: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  remove: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  byId: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  byEmail: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  bySubject: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
  byUsername: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
};

// Mock configuration module
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'jwt.secret') return 'test-secret';
          if (key === 'jwt.expiresIn') return '1h';
          return null;
        }),
      },
    },
  ],
  exports: [ConfigService],
})
class MockConfigModule {}

describe('RocketsServer (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let verifyTokenService: VerifyTokenServiceInterface;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MockConfigModule,
        TypeOrmExtModule.forRootAsync({
          inject: [],
          useFactory: () => {
            return ormConfig;
          },
        }),
        RocketsServerModule.forRoot({
          jwt: {
            settings: {
              access: { secret: 'test-secret' },
              default: { secret: 'test-secret' },
              refresh: { secret: 'test-secret' },
            },
          },
          user: {
            imports: [
              TypeOrmExtModule.forFeature({
                user: {
                  entity: UserFixture,
                },
              }),
            ],
          },
          otp: {
            imports: [
              TypeOrmExtModule.forFeature({
                userOtp: {
                  entity: UserOtpEntityFixture,
                },
              }),
            ],
          },
          services: {
            userModelService: mockUserModelService,
            mailerService: mockEmailService,
            issueTokenService: new IssueTokenServiceFixture(),
            validateTokenService: new ValidateTokenServiceFixture(),
          },
        }),
      ],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    verifyTokenService = moduleFixture.get<VerifyTokenServiceInterface>(
      AuthJwtVerifyTokenService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should access protected route with valid token', async () => {
      // Create a test token
      const token = await jwtService.signAsync(
        { sub: '1', username: 'test' },
        { secret: 'test-secret' },
      );

      // Make request with token
      const response = await request(app.getHttpServer())
        .get('/test/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'This is a protected route',
      });
    });

    it('should reject access to protected route without token', async () => {
      await request(app.getHttpServer()).get('/test/protected').expect(401);
    });

    it('should reject access to protected route with invalid token', async () => {
      // Spy on verifyTokenService to throw an error when verifying the token
      jest.spyOn(verifyTokenService, 'accessToken').mockImplementation(() => {
        throw new Error('Invalid token');
      });
      await request(app.getHttpServer())
        .get('/test/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
