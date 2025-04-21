"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthenticationOptionsProviders = exports.createAuthenticationOptionsExports = exports.createAuthenticationOptionsImports = exports.createAuthenticationOptionsControllers = exports.ROCKETS_AUTHENTICATION_MODULE_ASYNC_OPTIONS_TYPE = exports.ROCKETS_AUTHENTICATION_MODULE_OPTIONS_TYPE = exports.AuthenticationModuleClass = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rockets_authentication_options_default_config_1 = require("./config/rockets-authentication-options-default.config");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const nestjs_auth_local_1 = require("@concepta/nestjs-auth-local");
const nestjs_auth_recovery_1 = require("@concepta/nestjs-auth-recovery");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
const nestjs_auth_refresh_1 = require("@concepta/nestjs-auth-refresh");
const nestjs_user_1 = require("@concepta/nestjs-user");
const auth_password_controller_1 = require("./controllers/auth/auth-password.controller");
const auth_refresh_controller_1 = require("./controllers/auth/auth-refresh.controller");
const nestjs_auth_verify_1 = require("@concepta/nestjs-auth-verify");
const auth_signup_controller_1 = require("./controllers/auth/auth-signup.controller");
const auth_user_controller_1 = require("./controllers/user/auth-user.controller");
const nestjs_password_1 = require("@concepta/nestjs-password");
const nestjs_typeorm_ext_1 = require("@concepta/nestjs-typeorm-ext");
const RAW_OPTIONS_TOKEN = Symbol('__ROCKETS_AUTHENTICATION_MODULE_RAW_OPTIONS_TOKEN__');
_a = new common_1.ConfigurableModuleBuilder({
    moduleName: 'AuthenticationCombined',
    optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
    .setExtras({ global: false }, definitionTransform)
    .build(), exports.AuthenticationModuleClass = _a.ConfigurableModuleClass, exports.ROCKETS_AUTHENTICATION_MODULE_OPTIONS_TYPE = _a.OPTIONS_TYPE, exports.ROCKETS_AUTHENTICATION_MODULE_ASYNC_OPTIONS_TYPE = _a.ASYNC_OPTIONS_TYPE;
function definitionTransform(definition, extras) {
    const { imports = [], providers = [], exports = [] } = definition;
    const { entities, controllers } = extras;
    return Object.assign(Object.assign({}, definition), { global: extras.global, imports: createAuthenticationOptionsImports({ imports, entities }), controllers: createAuthenticationOptionsControllers({ controllers }), providers: createAuthenticationOptionsProviders({ providers }), exports: createAuthenticationOptionsExports({ exports }) });
}
function createAuthenticationOptionsControllers(options) {
    return (options === null || options === void 0 ? void 0 : options.controllers) !== undefined
        ? options.controllers
        :
            [
                auth_signup_controller_1.AuthSignupController,
                auth_user_controller_1.AuthUserController,
                auth_password_controller_1.AuthPasswordController,
                auth_refresh_controller_1.AuthTokenRefreshController,
                nestjs_auth_recovery_1.AuthRecoveryController,
            ];
}
exports.createAuthenticationOptionsControllers = createAuthenticationOptionsControllers;
function createAuthenticationOptionsImports(options) {
    return [
        ...(options.imports || []),
        config_1.ConfigModule.forFeature(rockets_authentication_options_default_config_1.authenticationOptionsDefaultConfig),
        nestjs_authentication_1.AuthenticationModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return {
                    verifyTokenService: ((_a = options.authentication) === null || _a === void 0 ? void 0 : _a.verifyTokenService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.verifyTokenService),
                    issueTokenService: ((_c = options.authentication) === null || _c === void 0 ? void 0 : _c.issueTokenService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.issueTokenService),
                    validateTokenService: ((_e = options.authentication) === null || _e === void 0 ? void 0 : _e.validateTokenService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.validateTokenService),
                    settings: (_g = options.authentication) === null || _g === void 0 ? void 0 : _g.settings,
                };
            },
        }),
        nestjs_jwt_1.JwtModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return {
                    jwtIssueTokenService: ((_a = options.jwt) === null || _a === void 0 ? void 0 : _a.jwtIssueTokenService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.jwtIssueTokenService),
                    jwtRefreshService: ((_c = options.jwt) === null || _c === void 0 ? void 0 : _c.jwtRefreshService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.jwtRefreshService),
                    jwtVerifyTokenService: ((_e = options.jwt) === null || _e === void 0 ? void 0 : _e.jwtVerifyTokenService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.jwtVerifyTokenService),
                    jwtAccessService: ((_g = options.jwt) === null || _g === void 0 ? void 0 : _g.jwtAccessService) || ((_h = options.services) === null || _h === void 0 ? void 0 : _h.jwtAccessService),
                    jwtService: ((_j = options.jwt) === null || _j === void 0 ? void 0 : _j.jwtService) || ((_k = options.services) === null || _k === void 0 ? void 0 : _k.jwtService),
                    settings: (_l = options.jwt) === null || _l === void 0 ? void 0 : _l.settings,
                };
            },
        }),
        nestjs_auth_jwt_1.AuthJwtModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    appGuard: (_a = options.authJwt) === null || _a === void 0 ? void 0 : _a.appGuard,
                    verifyTokenService: ((_b = options.authJwt) === null || _b === void 0 ? void 0 : _b.verifyTokenService) ||
                        ((_c = options.services) === null || _c === void 0 ? void 0 : _c.verifyTokenService),
                    userLookupService: ((_d = options.authJwt) === null || _d === void 0 ? void 0 : _d.userLookupService) ||
                        ((_e = options.services) === null || _e === void 0 ? void 0 : _e.userLookupService),
                    settings: (_f = options.authJwt) === null || _f === void 0 ? void 0 : _f.settings,
                };
            },
        }),
        nestjs_auth_refresh_1.AuthRefreshModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return {
                    verifyTokenService: ((_a = options.refresh) === null || _a === void 0 ? void 0 : _a.verifyTokenService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.verifyTokenService),
                    issueTokenService: ((_c = options.refresh) === null || _c === void 0 ? void 0 : _c.issueTokenService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.issueTokenService),
                    userLookupService: ((_e = options.refresh) === null || _e === void 0 ? void 0 : _e.userLookupService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.userLookupService),
                    settings: (_g = options.refresh) === null || _g === void 0 ? void 0 : _g.settings,
                };
            },
        }),
        nestjs_auth_local_1.AuthLocalModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return {
                    passwordValidationService: (_a = options.authLocal) === null || _a === void 0 ? void 0 : _a.passwordValidationService,
                    validateUserService: ((_b = options.authLocal) === null || _b === void 0 ? void 0 : _b.validateUserService) ||
                        ((_c = options.services) === null || _c === void 0 ? void 0 : _c.validateUserService),
                    issueTokenService: ((_d = options.authLocal) === null || _d === void 0 ? void 0 : _d.issueTokenService) ||
                        ((_e = options.services) === null || _e === void 0 ? void 0 : _e.issueTokenService),
                    userLookupService: ((_f = options.authLocal) === null || _f === void 0 ? void 0 : _f.userLookupService) ||
                        ((_g = options.services) === null || _g === void 0 ? void 0 : _g.userLookupService),
                    settings: (_h = options.authLocal) === null || _h === void 0 ? void 0 : _h.settings,
                };
            },
        }),
        nestjs_auth_recovery_1.AuthRecoveryModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return {
                    emailService: ((_a = options.authRecovery) === null || _a === void 0 ? void 0 : _a.emailService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.emailService),
                    otpService: ((_c = options.authRecovery) === null || _c === void 0 ? void 0 : _c.otpService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.otpService),
                    userLookupService: ((_e = options.authRecovery) === null || _e === void 0 ? void 0 : _e.userLookupService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.userLookupService),
                    userMutateService: options.services.userMutateService,
                    entityManagerProxy: (_g = options.authRecovery) === null || _g === void 0 ? void 0 : _g.entityManagerProxy,
                    notificationService: ((_h = options.authRecovery) === null || _h === void 0 ? void 0 : _h.notificationService) ||
                        ((_j = options.services) === null || _j === void 0 ? void 0 : _j.notificationService),
                    settings: (_k = options.authRecovery) === null || _k === void 0 ? void 0 : _k.settings,
                };
            },
        }),
        nestjs_auth_verify_1.AuthVerifyModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return {
                    emailService: ((_a = options.authVerify) === null || _a === void 0 ? void 0 : _a.emailService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.emailService),
                    otpService: ((_c = options.authVerify) === null || _c === void 0 ? void 0 : _c.otpService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.otpService),
                    userLookupService: ((_e = options.authVerify) === null || _e === void 0 ? void 0 : _e.userLookupService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.userLookupService),
                    userMutateService: ((_g = options.authVerify) === null || _g === void 0 ? void 0 : _g.userMutateService) ||
                        ((_h = options.services) === null || _h === void 0 ? void 0 : _h.userMutateService),
                    entityManagerProxy: (_j = options.authVerify) === null || _j === void 0 ? void 0 : _j.entityManagerProxy,
                    notificationService: ((_k = options.authVerify) === null || _k === void 0 ? void 0 : _k.notificationService) ||
                        ((_l = options.services) === null || _l === void 0 ? void 0 : _l.notificationService),
                    settings: (_m = options.authVerify) === null || _m === void 0 ? void 0 : _m.settings,
                };
            },
        }),
        nestjs_password_1.PasswordModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a;
                return {
                    settings: (_a = options.password) === null || _a === void 0 ? void 0 : _a.settings,
                };
            }
        }),
        nestjs_typeorm_ext_1.TypeOrmExtModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                return options.typeorm;
            }
        }),
        nestjs_user_1.UserModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return {
                    settings: (_a = options.user) === null || _a === void 0 ? void 0 : _a.settings,
                    userLookupService: ((_b = options.user) === null || _b === void 0 ? void 0 : _b.userLookupService) || ((_c = options.services) === null || _c === void 0 ? void 0 : _c.userLookupService),
                    userMutateService: ((_d = options.user) === null || _d === void 0 ? void 0 : _d.userMutateService) || ((_e = options.services) === null || _e === void 0 ? void 0 : _e.userMutateService),
                    userPasswordService: ((_f = options.user) === null || _f === void 0 ? void 0 : _f.userPasswordService) || ((_g = options.services) === null || _g === void 0 ? void 0 : _g.userPasswordService),
                    userAccessQueryService: ((_h = options.user) === null || _h === void 0 ? void 0 : _h.userAccessQueryService) || ((_j = options.services) === null || _j === void 0 ? void 0 : _j.userAccessQueryService),
                    userPasswordHistoryService: ((_k = options.user) === null || _k === void 0 ? void 0 : _k.userPasswordHistoryService) || ((_l = options.services) === null || _l === void 0 ? void 0 : _l.userPasswordHistoryService),
                };
            },
            entities: options.entities,
        }),
    ];
}
exports.createAuthenticationOptionsImports = createAuthenticationOptionsImports;
function createAuthenticationOptionsExports(options) {
    return [
        ...(options.exports || []),
        config_1.ConfigModule,
        RAW_OPTIONS_TOKEN,
        nestjs_jwt_1.JwtModule,
        nestjs_auth_jwt_1.AuthJwtModule,
        nestjs_auth_refresh_1.AuthRefreshModule,
    ];
}
exports.createAuthenticationOptionsExports = createAuthenticationOptionsExports;
function createAuthenticationOptionsProviders(options) {
    var _a;
    return [...((_a = options.providers) !== null && _a !== void 0 ? _a : [])];
}
exports.createAuthenticationOptionsProviders = createAuthenticationOptionsProviders;
//# sourceMappingURL=rockets-authentication.module-definition.js.map