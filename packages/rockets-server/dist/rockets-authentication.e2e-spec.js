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
const rockets_authentication_module_1 = require("./rockets-authentication.module");
const config_1 = require("@nestjs/config");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
const otp_service_fixture_1 = require("./__fixtures__/services/otp.service.fixture");
const verify_token_service_fixture_1 = require("./__fixtures__/services/verify-token.service.fixture");
const issue_token_service_fixture_1 = require("./__fixtures__/services/issue-token.service.fixture");
const validate_token_service_fixture_1 = require("./__fixtures__/services/validate-token.service.fixture");
const ormconfig_fixture_1 = require("./__fixtures__/ormconfig.fixture");
let TestController = class TestController {
    async getProtected() {
        return { message: 'This is a protected route' };
    }
};
__decorate([
    (0, common_1.Get)('protected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getProtected", null);
TestController = __decorate([
    (0, common_1.Controller)('test'),
    (0, common_1.UseGuards)(nestjs_auth_jwt_1.AuthJwtGuard)
], TestController);
exports.TestController = TestController;
const mockUserLookupService = {
    byId: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    bySubject: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byUsername: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byEmail: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
};
const mockEmailService = {
    sendMail: jest.fn().mockResolvedValue(undefined),
};
const mockUserMutateService = {
    update: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
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
describe('RocketsAuthentication (e2e)', () => {
    let app;
    let jwtService;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                MockConfigModule,
                rockets_authentication_module_1.RocketsAuthenticationModule.forRoot({
                    typeorm: ormconfig_fixture_1.ormConfig,
                    jwt: {
                        settings: {
                            access: { secret: 'test-secret' },
                            default: { secret: 'test-secret' },
                            refresh: { secret: 'test-secret' },
                        },
                    },
                    services: {
                        userLookupService: mockUserLookupService,
                        emailService: mockEmailService,
                        userMutateService: mockUserMutateService,
                        otpService: new otp_service_fixture_1.OtpServiceFixture(),
                        verifyTokenService: new verify_token_service_fixture_1.VerifyTokenServiceFixture(),
                        issueTokenService: new issue_token_service_fixture_1.IssueTokenServiceFixture(),
                        validateTokenService: new validate_token_service_fixture_1.ValidateTokenServiceFixture(),
                    },
                }),
            ],
            controllers: [TestController],
        }).compile();
        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get(nestjs_jwt_1.JwtService);
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
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/test/protected')
                .expect(401);
        });
        it('should reject access to protected route with invalid token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/test/protected')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});
//# sourceMappingURL=rockets-authentication.e2e-spec.js.map