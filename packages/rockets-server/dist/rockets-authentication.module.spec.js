"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmModuleFixture = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const global_module_fixture_1 = require("./__fixtures__/global.module.fixture");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
const auth_refresh_strategy_1 = require("@concepta/nestjs-auth-refresh/dist/auth-refresh.strategy");
const nestjs_auth_refresh_1 = require("@concepta/nestjs-auth-refresh");
const rockets_authentication_module_1 = require("./rockets-authentication.module");
const verify_token_service_fixture_1 = require("./__fixtures__/services/verify-token.service.fixture");
const issue_token_service_fixture_1 = require("./__fixtures__/services/issue-token.service.fixture");
const validate_token_service_fixture_1 = require("./__fixtures__/services/validate-token.service.fixture");
const otp_service_fixture_1 = require("./__fixtures__/services/otp.service.fixture");
const typeorm_common_1 = require("@concepta/typeorm-common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_fixture_1 = require("./__fixtures__/user/user.entity.fixture");
const user_password_history_entity_fixture_1 = require("./__fixtures__/user/user-password-history.entity.fixture");
const user_profile_entity_fixture_1 = require("./__fixtures__/user/user-profile.entity.fixture");
const ormconfig_fixture_1 = require("./__fixtures__/ormconfig.fixture");
const mockUserLookupService = {
    bySubject: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byUsername: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byId: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
    byEmail: jest.fn().mockResolvedValue({ id: '1', username: 'test', email: 'test@example.com' }),
};
const mockEmailService = {
    sendMail: jest.fn().mockResolvedValue(undefined),
};
const mockUserMutateService = {
    update: jest.fn().mockResolvedValue({ id: '1', username: 'test' }),
};
let TypeOrmModuleFixture = class TypeOrmModuleFixture {
};
TypeOrmModuleFixture = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: (0, typeorm_1.getEntityManagerToken)(),
                useFactory: typeorm_common_1.createEntityManagerMock,
            },
        ],
        exports: [(0, typeorm_1.getEntityManagerToken)()],
    })
], TypeOrmModuleFixture);
exports.TypeOrmModuleFixture = TypeOrmModuleFixture;
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
function testModuleFactory(extraImports = []) {
    return {
        imports: [
            global_module_fixture_1.GlobalModuleFixture,
            MockConfigModule,
            nestjs_jwt_1.JwtModule.forRoot({}),
            ...extraImports,
        ]
    };
}
describe('AuthenticationCombinedImportModule Integration', () => {
    function commonVars(testModule) {
        const jwtService = testModule.get(nestjs_jwt_1.JwtService);
        const verifyTokenService = testModule.get(nestjs_authentication_1.VerifyTokenService);
        const issueTokenService = testModule.get(nestjs_authentication_1.IssueTokenService);
        const jwtIssueTokenService = testModule.get(nestjs_jwt_1.JwtIssueTokenService);
        const jwtVerifyTokenService = testModule.get(nestjs_jwt_1.JwtVerifyTokenService);
        const authJwtStrategy = testModule.get(nestjs_auth_jwt_1.AuthJwtStrategy);
        const authJwtGuard = testModule.get(nestjs_auth_jwt_1.AuthJwtGuard);
        const authRefreshStrategy = testModule.get(auth_refresh_strategy_1.AuthRefreshStrategy);
        const authRefreshGuard = testModule.get(nestjs_auth_refresh_1.AuthRefreshGuard);
        return {
            jwtService,
            verifyTokenService,
            issueTokenService,
            jwtIssueTokenService,
            jwtVerifyTokenService,
            authJwtStrategy,
            authJwtGuard,
            authRefreshStrategy,
            authRefreshGuard,
        };
    }
    function commonTests(services) {
        expect(services.jwtService).toBeDefined();
        expect(services.verifyTokenService).toBeDefined();
        expect(services.issueTokenService).toBeDefined();
        expect(services.jwtIssueTokenService).toBeDefined();
        expect(services.jwtVerifyTokenService).toBeDefined();
        expect(services.authJwtStrategy).toBeDefined();
        expect(services.authJwtGuard).toBeDefined();
        expect(services.authRefreshStrategy).toBeDefined();
        expect(services.authRefreshGuard).toBeDefined();
    }
    describe('forRootAsync with import strategy', () => {
        let testModule;
        it('should define all required services and modules', async () => {
            testModule = await testing_1.Test.createTestingModule(testModuleFactory([
                rockets_authentication_module_1.RocketsAuthenticationModule.forRootAsync({
                    imports: [TypeOrmModuleFixture, MockConfigModule],
                    inject: [
                        config_1.ConfigService,
                        verify_token_service_fixture_1.VerifyTokenServiceFixture,
                        issue_token_service_fixture_1.IssueTokenServiceFixture,
                        validate_token_service_fixture_1.ValidateTokenServiceFixture,
                    ],
                    entities: {
                        user: {
                            entity: user_entity_fixture_1.UserFixture,
                        },
                        "user-password-history": {
                            entity: user_password_history_entity_fixture_1.UserPasswordHistoryEntityFixture
                        },
                        "user-profile": {
                            entity: user_profile_entity_fixture_1.UserProfileEntityFixture
                        }
                    },
                    useFactory: (configService, verifyTokenService, issueTokenService, validateTokenService) => ({
                        typeorm: ormconfig_fixture_1.ormConfig,
                        jwt: {
                            settings: {
                                access: { secret: configService.get('jwt.secret') },
                                default: { secret: configService.get('jwt.secret') },
                                refresh: { secret: configService.get('jwt.secret') },
                            },
                        },
                        services: {
                            userLookupService: mockUserLookupService,
                            emailService: mockEmailService,
                            userMutateService: mockUserMutateService,
                            otpService: new otp_service_fixture_1.OtpServiceFixture(),
                            verifyTokenService,
                            issueTokenService,
                            validateTokenService,
                        }
                    }),
                }),
            ])).compile();
            const services = commonVars(testModule);
            commonTests(services);
            expect(testModule.get(config_1.ConfigService)).toBeDefined();
            const vts = testModule.get(nestjs_authentication_1.VerifyTokenService);
            expect(vts).toBeInstanceOf(nestjs_authentication_1.VerifyTokenService);
        });
    });
    describe('forRoot (sync) with direct options', () => {
        let testModule;
        it('should define all required services and modules', async () => {
            testModule = await testing_1.Test.createTestingModule(testModuleFactory([
                TypeOrmModuleFixture,
                rockets_authentication_module_1.RocketsAuthenticationModule.forRoot({
                    typeorm: ormconfig_fixture_1.ormConfig,
                    jwt: {
                        settings: {
                            access: { secret: 'test-secret-forroot' },
                            default: { secret: 'test-secret-forroot' },
                            refresh: { secret: 'test-secret-forroot' },
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
                    entities: {
                        user: {
                            entity: user_entity_fixture_1.UserFixture,
                        },
                        "user-password-history": {
                            entity: user_password_history_entity_fixture_1.UserPasswordHistoryEntityFixture
                        },
                        "user-profile": {
                            entity: user_profile_entity_fixture_1.UserProfileEntityFixture
                        }
                    },
                }),
            ])).compile();
            const services = commonVars(testModule);
            commonTests(services);
        });
    });
    describe('with custom refresh controller', () => {
        let testModule;
        it('should use custom refresh controller when provided', async () => {
            testModule = await testing_1.Test.createTestingModule(testModuleFactory([
                TypeOrmModuleFixture,
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
                    entities: {
                        user: {
                            entity: user_entity_fixture_1.UserFixture,
                        },
                        "user-password-history": {
                            entity: user_password_history_entity_fixture_1.UserPasswordHistoryEntityFixture
                        },
                        "user-profile": {
                            entity: user_profile_entity_fixture_1.UserProfileEntityFixture
                        }
                    },
                }),
            ])).compile();
            const authRefreshGuard = testModule.get(nestjs_auth_refresh_1.AuthRefreshGuard);
            expect(authRefreshGuard).toBeDefined();
        });
    });
});
//# sourceMappingURL=rockets-authentication.module.spec.js.map