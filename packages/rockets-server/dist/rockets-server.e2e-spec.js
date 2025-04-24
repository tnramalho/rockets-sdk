"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const rockets_server_module_1 = require("./rockets-server.module");
const config_1 = require("@nestjs/config");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
const issue_token_service_fixture_1 = require("./__fixtures__/services/issue-token.service.fixture");
const validate_token_service_fixture_1 = require("./__fixtures__/services/validate-token.service.fixture");
const ormconfig_fixture_1 = require("./__fixtures__/ormconfig.fixture");
const swagger_1 = require("@nestjs/swagger");
const user_entity_fixture_1 = require("./__fixtures__/user/user.entity.fixture");
const user_otp_entity_fixture_1 = require("./__fixtures__/user/user-otp-entity.fixture");
let TestController = class TestController {
    async getProtected() {
        return { message: 'This is a protected route' };
    }
};
__decorate([
    (0, common_1.Get)('protected'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully accessed protected route',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized access' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getProtected", null);
TestController = __decorate([
    (0, common_1.Controller)('test'),
    (0, swagger_1.ApiTags)('test'),
    (0, common_1.UseGuards)(nestjs_auth_jwt_1.AuthJwtGuard)
], TestController);
exports.TestController = TestController;
const mockEmailService = {
    sendMail: jest.fn().mockResolvedValue(undefined),
};
const mockUserModelService = {
    update: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    create: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    replace: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    remove: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byId: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byEmail: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    bySubject: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byUsername: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
};
let MockConfigModule = class MockConfigModule {
};
MockConfigModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: config_1.ConfigService,
                useValue: {
                    get: jest.fn().mockImplementation((key) => {
                        if (key === 'jwt.secret')
                            return 'test-secret';
                        if (key === 'jwt.expiresIn')
                            return '1h';
                        return null;
                    }),
                },
            },
        ],
        exports: [config_1.ConfigService],
    })
], MockConfigModule);
describe('RocketsServer (e2e)', () => {
    let app;
    let jwtService;
    let verifyTokenService;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                MockConfigModule,
                rockets_server_module_1.RocketsServerModule.forRoot({
                    typeorm: ormconfig_fixture_1.ormConfig,
                    jwt: {
                        settings: {
                            access: { secret: 'test-secret' },
                            default: { secret: 'test-secret' },
                            refresh: { secret: 'test-secret' },
                        },
                    },
                    services: {
                        userModelService: mockUserModelService,
                        mailerService: mockEmailService,
                        issueTokenService: new issue_token_service_fixture_1.IssueTokenServiceFixture(),
                        validateTokenService: new validate_token_service_fixture_1.ValidateTokenServiceFixture(),
                    },
                    entities: {
                        user: {
                            entity: user_entity_fixture_1.UserFixture,
                        },
                        userOtp: {
                            entity: user_otp_entity_fixture_1.UserOtpEntityFixture,
                        },
                    },
                }),
            ],
            controllers: [TestController],
        }).compile();
        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get(nestjs_jwt_1.JwtService);
        verifyTokenService = moduleFixture.get(nestjs_auth_jwt_1.AuthJwtVerifyTokenService);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Authentication Flow', () => {
        it('should access protected route with valid token', async () => {
            const token = await jwtService.signAsync({ sub: '1', username: 'test' }, { secret: 'test-secret' });
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .get('/test/protected')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(response.body).toEqual({
                message: 'This is a protected route',
            });
        });
        it('should reject access to protected route without token', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get('/test/protected').expect(401);
        });
        it('should reject access to protected route with invalid token', async () => {
            jest.spyOn(verifyTokenService, 'accessToken').mockImplementation(() => {
                throw new Error('Invalid token');
            });
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/test/protected')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});
//# sourceMappingURL=rockets-server.e2e-spec.js.map