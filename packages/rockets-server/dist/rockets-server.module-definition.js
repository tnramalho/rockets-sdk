"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRocketsServerProviders = exports.createRocketsServerExports = exports.createRocketsServerImports = exports.createRocketsServerSettingsProvider = exports.createRocketsServerControllers = exports.ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE = exports.ROCKETS_SERVER_MODULE_OPTIONS_TYPE = exports.RocketsServerModuleClass = void 0;
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
const nestjs_auth_local_1 = require("@concepta/nestjs-auth-local");
const nestjs_auth_recovery_1 = require("@concepta/nestjs-auth-recovery");
const nestjs_auth_refresh_1 = require("@concepta/nestjs-auth-refresh");
const nestjs_auth_verify_1 = require("@concepta/nestjs-auth-verify");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const nestjs_common_1 = require("@concepta/nestjs-common");
const nestjs_email_1 = require("@concepta/nestjs-email");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
const nestjs_otp_1 = require("@concepta/nestjs-otp");
const nestjs_password_1 = require("@concepta/nestjs-password");
const nestjs_typeorm_ext_1 = require("@concepta/nestjs-typeorm-ext");
const nestjs_user_1 = require("@concepta/nestjs-user");
const user_constants_1 = require("@concepta/nestjs-user/dist/user.constants");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rockets_server_options_default_config_1 = require("./config/rockets-server-options-default.config");
const auth_password_controller_1 = require("./controllers/auth/auth-password.controller");
const auth_recovery_controller_1 = require("./controllers/auth/auth-recovery.controller");
const auth_refresh_controller_1 = require("./controllers/auth/auth-refresh.controller");
const auth_signup_controller_1 = require("./controllers/auth/auth-signup.controller");
const rockets_server_otp_controller_1 = require("./controllers/otp/rockets-server-otp.controller");
const rockets_server_user_controller_1 = require("./controllers/user/rockets-server-user.controller");
const rockets_server_constants_1 = require("./rockets-server.constants");
const rockets_server_notification_service_1 = require("./services/rockets-server-notification.service");
const rockets_server_otp_service_1 = require("./services/rockets-server-otp.service");
const RAW_OPTIONS_TOKEN = Symbol('__ROCKETS_SERVER_MODULE_RAW_OPTIONS_TOKEN__');
_a = new common_1.ConfigurableModuleBuilder({
    moduleName: 'RocketsServer',
    optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
    .setExtras({ global: false }, definitionTransform)
    .build(), exports.RocketsServerModuleClass = _a.ConfigurableModuleClass, exports.ROCKETS_SERVER_MODULE_OPTIONS_TYPE = _a.OPTIONS_TYPE, exports.ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE = _a.ASYNC_OPTIONS_TYPE;
function definitionTransform(definition, extras) {
    const { imports = [], providers = [], exports = [] } = definition;
    const { entities, controllers } = extras;
    if (!entities)
        throw new Error('Entities Required');
    return Object.assign(Object.assign({}, definition), { global: extras.global, imports: createRocketsServerImports({ imports, entities }), controllers: createRocketsServerControllers({ controllers }), providers: createRocketsServerProviders({ providers }), exports: createRocketsServerExports({ exports }) });
}
function createRocketsServerControllers(options) {
    return (options === null || options === void 0 ? void 0 : options.controllers) !== undefined
        ? options.controllers
        : [
            auth_signup_controller_1.AuthSignupController,
            rockets_server_user_controller_1.RocketsServerUserController,
            auth_password_controller_1.AuthPasswordController,
            auth_refresh_controller_1.AuthTokenRefreshController,
            auth_recovery_controller_1.RocketsServerRecoveryController,
            rockets_server_otp_controller_1.RocketsServerOtpController,
        ];
}
exports.createRocketsServerControllers = createRocketsServerControllers;
function createRocketsServerSettingsProvider(optionsOverrides) {
    return (0, nestjs_common_1.createSettingsProvider)({
        settingsToken: rockets_server_constants_1.ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
        optionsToken: RAW_OPTIONS_TOKEN,
        settingsKey: rockets_server_options_default_config_1.authenticationOptionsDefaultConfig.KEY,
        optionsOverrides,
    });
}
exports.createRocketsServerSettingsProvider = createRocketsServerSettingsProvider;
function createRocketsServerImports(options) {
    var _a, _b;
    return [
        ...(options.imports || []),
        config_1.ConfigModule.forFeature(rockets_server_options_default_config_1.authenticationOptionsDefaultConfig),
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
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return {
                    jwtIssueTokenService: ((_a = options.jwt) === null || _a === void 0 ? void 0 : _a.jwtIssueTokenService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.issueTokenService),
                    jwtVerifyTokenService: ((_c = options.jwt) === null || _c === void 0 ? void 0 : _c.jwtVerifyTokenService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.verifyTokenService),
                    jwtRefreshService: (_e = options.jwt) === null || _e === void 0 ? void 0 : _e.jwtRefreshService,
                    jwtAccessService: (_f = options.jwt) === null || _f === void 0 ? void 0 : _f.jwtAccessService,
                    jwtService: (_g = options.jwt) === null || _g === void 0 ? void 0 : _g.jwtService,
                    settings: (_h = options.jwt) === null || _h === void 0 ? void 0 : _h.settings,
                };
            },
        }),
        nestjs_auth_jwt_1.AuthJwtModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN, nestjs_user_1.UserModelService],
            useFactory: (options, userModelService) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    appGuard: (_a = options.authJwt) === null || _a === void 0 ? void 0 : _a.appGuard,
                    verifyTokenService: ((_b = options.authJwt) === null || _b === void 0 ? void 0 : _b.verifyTokenService) ||
                        ((_c = options.services) === null || _c === void 0 ? void 0 : _c.verifyTokenService),
                    userModelService: ((_d = options.authJwt) === null || _d === void 0 ? void 0 : _d.userModelService) ||
                        ((_e = options.services) === null || _e === void 0 ? void 0 : _e.userModelService) ||
                        userModelService,
                    settings: (_f = options.authJwt) === null || _f === void 0 ? void 0 : _f.settings,
                };
            },
        }),
        nestjs_auth_refresh_1.AuthRefreshModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN, nestjs_user_1.UserModelService],
            controllers: [],
            useFactory: (options, userModelService) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return {
                    verifyTokenService: ((_a = options.refresh) === null || _a === void 0 ? void 0 : _a.verifyTokenService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.verifyTokenService),
                    issueTokenService: ((_c = options.refresh) === null || _c === void 0 ? void 0 : _c.issueTokenService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.issueTokenService),
                    userModelService: ((_e = options.refresh) === null || _e === void 0 ? void 0 : _e.userModelService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.userModelService) ||
                        userModelService,
                    settings: (_g = options.refresh) === null || _g === void 0 ? void 0 : _g.settings,
                };
            },
        }),
        nestjs_auth_local_1.AuthLocalModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN, nestjs_user_1.UserModelService],
            controllers: [],
            useFactory: (options, userModelService) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return {
                    passwordValidationService: (_a = options.authLocal) === null || _a === void 0 ? void 0 : _a.passwordValidationService,
                    validateUserService: ((_b = options.authLocal) === null || _b === void 0 ? void 0 : _b.validateUserService) ||
                        ((_c = options.services) === null || _c === void 0 ? void 0 : _c.validateUserService),
                    issueTokenService: ((_d = options.authLocal) === null || _d === void 0 ? void 0 : _d.issueTokenService) ||
                        ((_e = options.services) === null || _e === void 0 ? void 0 : _e.issueTokenService),
                    userModelService: ((_f = options.authLocal) === null || _f === void 0 ? void 0 : _f.userModelService) ||
                        ((_g = options.services) === null || _g === void 0 ? void 0 : _g.userModelService) ||
                        userModelService,
                    settings: (_h = options.authLocal) === null || _h === void 0 ? void 0 : _h.settings,
                };
            },
        }),
        nestjs_auth_recovery_1.AuthRecoveryModule.forRootAsync({
            inject: [
                RAW_OPTIONS_TOKEN,
                nestjs_email_1.EmailService,
                nestjs_otp_1.OtpService,
                nestjs_user_1.UserModelService,
                nestjs_user_1.UserPasswordService,
            ],
            controllers: [],
            useFactory: (options, defaultEmailService, defaultOtpService, userModelService, defaultUserPasswordService) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return {
                    emailService: defaultEmailService,
                    otpService: defaultOtpService,
                    userModelService: ((_a = options.authRecovery) === null || _a === void 0 ? void 0 : _a.userModelService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.userModelService) ||
                        userModelService,
                    userPasswordService: ((_c = options.authRecovery) === null || _c === void 0 ? void 0 : _c.userPasswordService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.userPasswordService) ||
                        defaultUserPasswordService,
                    notificationService: ((_e = options.authRecovery) === null || _e === void 0 ? void 0 : _e.notificationService) ||
                        ((_f = options.services) === null || _f === void 0 ? void 0 : _f.notificationService),
                    settings: (_g = options.authRecovery) === null || _g === void 0 ? void 0 : _g.settings,
                };
            },
        }),
        nestjs_auth_verify_1.AuthVerifyModule.forRootAsync({
            inject: [
                RAW_OPTIONS_TOKEN,
                nestjs_email_1.EmailService,
                nestjs_user_1.UserModelService,
                nestjs_otp_1.OtpService,
            ],
            controllers: [],
            useFactory: (options, defaultEmailService, userModelService, defaultOtpService) => {
                var _a, _b, _c, _d, _e;
                return {
                    emailService: defaultEmailService,
                    otpService: defaultOtpService,
                    userModelService: ((_a = options.authVerify) === null || _a === void 0 ? void 0 : _a.userModelService) ||
                        ((_b = options.services) === null || _b === void 0 ? void 0 : _b.userModelService) ||
                        userModelService,
                    notificationService: ((_c = options.authVerify) === null || _c === void 0 ? void 0 : _c.notificationService) ||
                        ((_d = options.services) === null || _d === void 0 ? void 0 : _d.notificationService),
                    settings: (_e = options.authVerify) === null || _e === void 0 ? void 0 : _e.settings,
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
            },
        }),
        nestjs_typeorm_ext_1.TypeOrmExtModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                return options.typeorm;
            },
        }),
        nestjs_user_1.UserModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            controllers: [],
            useFactory: (options) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return {
                    settings: (_a = options.user) === null || _a === void 0 ? void 0 : _a.settings,
                    userModelService: ((_b = options.user) === null || _b === void 0 ? void 0 : _b.userModelService) ||
                        ((_c = options.services) === null || _c === void 0 ? void 0 : _c.userModelService),
                    userPasswordService: ((_d = options.user) === null || _d === void 0 ? void 0 : _d.userPasswordService) ||
                        ((_e = options.services) === null || _e === void 0 ? void 0 : _e.userPasswordService),
                    userAccessQueryService: ((_f = options.user) === null || _f === void 0 ? void 0 : _f.userAccessQueryService) ||
                        ((_g = options.services) === null || _g === void 0 ? void 0 : _g.userAccessQueryService),
                    userPasswordHistoryService: ((_h = options.user) === null || _h === void 0 ? void 0 : _h.userPasswordHistoryService) ||
                        ((_j = options.services) === null || _j === void 0 ? void 0 : _j.userPasswordHistoryService),
                };
            },
            entities: Object.assign(Object.assign({ [user_constants_1.USER_MODULE_USER_ENTITY_KEY]: options.entities.user }, (((_a = options.entities) === null || _a === void 0 ? void 0 : _a.userPasswordHistory)
                ? {
                    [user_constants_1.USER_MODULE_USER_PASSWORD_HISTORY_ENTITY_KEY]: options.entities.userPasswordHistory,
                }
                : {})), (((_b = options.entities) === null || _b === void 0 ? void 0 : _b.userProfile)
                ? {
                    [user_constants_1.USER_MODULE_USER_PROFILE_ENTITY_KEY]: options.entities.userProfile,
                }
                : {})),
        }),
        nestjs_otp_1.OtpModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a;
                return {
                    settings: (_a = options.otp) === null || _a === void 0 ? void 0 : _a.settings,
                };
            },
            entities: {
                userOtp: options.entities.userOtp,
            },
        }),
        nestjs_email_1.EmailModule.forRootAsync({
            inject: [RAW_OPTIONS_TOKEN],
            useFactory: (options) => {
                var _a, _b;
                return {
                    settings: (_a = options.otp) === null || _a === void 0 ? void 0 : _a.settings,
                    mailerService: ((_b = options.email) === null || _b === void 0 ? void 0 : _b.mailerService) || options.services.mailerService,
                };
            },
        }),
    ];
}
exports.createRocketsServerImports = createRocketsServerImports;
function createRocketsServerExports(options) {
    return [
        ...(options.exports || []),
        config_1.ConfigModule,
        RAW_OPTIONS_TOKEN,
        nestjs_jwt_1.JwtModule,
        nestjs_auth_jwt_1.AuthJwtModule,
        nestjs_auth_refresh_1.AuthRefreshModule,
    ];
}
exports.createRocketsServerExports = createRocketsServerExports;
function createRocketsServerProviders(options) {
    var _a;
    return [
        ...((_a = options.providers) !== null && _a !== void 0 ? _a : []),
        {
            provide: rockets_server_constants_1.RocketsServerUserLookupService,
            inject: [RAW_OPTIONS_TOKEN, nestjs_user_1.UserModelService],
            useFactory: async (options, userModelService) => {
                return options.services.userModelService || userModelService;
            },
        },
        rockets_server_otp_service_1.RocketsServerOtpService,
        rockets_server_notification_service_1.RocketsServerNotificationService,
        createRocketsServerSettingsProvider(),
    ];
}
exports.createRocketsServerProviders = createRocketsServerProviders;
//# sourceMappingURL=rockets-server.module-definition.js.map