import { AuthJwtModule } from '@concepta/nestjs-auth-jwt';
import { AuthJwtOptionsInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-options.interface';
import { AuthAppleModule } from '@concepta/nestjs-auth-apple';
import { AuthAppleOptionsInterface } from '@concepta/nestjs-auth-apple/dist/interfaces/auth-apple-options.interface';
import { AuthGithubModule } from '@concepta/nestjs-auth-github';
import { AuthGithubOptionsInterface } from '@concepta/nestjs-auth-github/dist/interfaces/auth-github-options.interface';
import { AuthGoogleModule } from '@concepta/nestjs-auth-google';
import { AuthGoogleOptionsInterface } from '@concepta/nestjs-auth-google/dist/interfaces/auth-google-options.interface';
import { AuthLocalModule } from '@concepta/nestjs-auth-local';
import { AuthLocalOptionsInterface } from '@concepta/nestjs-auth-local/dist/interfaces/auth-local-options.interface';
import { AuthRecoveryModule } from '@concepta/nestjs-auth-recovery';
import { AuthRecoveryOptionsInterface } from '@concepta/nestjs-auth-recovery/dist/interfaces/auth-recovery-options.interface';
import { AuthRefreshModule } from '@concepta/nestjs-auth-refresh';
import { AuthRefreshOptionsInterface } from '@concepta/nestjs-auth-refresh/dist/interfaces/auth-refresh-options.interface';
import { AuthVerifyModule } from '@concepta/nestjs-auth-verify';
import { AuthVerifyOptionsInterface } from '@concepta/nestjs-auth-verify/dist/interfaces/auth-verify-options.interface';
import { AuthenticationModule } from '@concepta/nestjs-authentication';
import { createSettingsProvider } from '@concepta/nestjs-common';
import {
  EmailModule,
  EmailService,
  EmailServiceInterface,
} from '@concepta/nestjs-email';
import { FederatedModule } from '@concepta/nestjs-federated';
import { FederatedOptionsInterface } from '@concepta/nestjs-federated/dist/interfaces/federated-options.interface';
import { JwtModule } from '@concepta/nestjs-jwt';
import { JwtOptionsInterface } from '@concepta/nestjs-jwt/dist/interfaces/jwt-options.interface';
import {
  AuthRouterGuardConfigInterface,
  AuthRouterModule,
  AuthRouterOptionsInterface,
} from '@concepta/nestjs-auth-router';
import { CrudModule } from '@concepta/nestjs-crud';
import { AuthAppleGuard } from '@concepta/nestjs-auth-apple';
import { AuthGithubGuard } from '@concepta/nestjs-auth-github';
import { AuthGoogleGuard } from '@concepta/nestjs-auth-google';
import { OtpModule, OtpService } from '@concepta/nestjs-otp';
import { PasswordModule } from '@concepta/nestjs-password';
import { RoleModule } from '@concepta/nestjs-role';
import {
  UserModule,
  UserModelService,
  UserPasswordService,
} from '@concepta/nestjs-user';
import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authenticationOptionsDefaultConfig } from './config/rockets-server-options-default.config';
import { AuthPasswordController } from './controllers/auth/auth-password.controller';
import { RocketsServerRecoveryController } from './controllers/auth/auth-recovery.controller';
import { AuthTokenRefreshController } from './controllers/auth/auth-refresh.controller';
import { AuthSignupController } from './controllers/auth/auth-signup.controller';
import { AuthOAuthController } from './controllers/oauth/auth-oauth.controller';
import { RocketsServerOtpController } from './controllers/otp/rockets-server-otp.controller';
import { RocketsServerUserController } from './controllers/user/rockets-server-user.controller';
import { AdminUserCrudBuilder } from './utils/admin-user.crud-builder';
import { AdminOptionsExtrasInterface, RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
import { RocketsServerSettingsInterface } from './interfaces/rockets-server-settings.interface';
import {
  ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
  RocketsServerUserLookupService,
  ADMIN_USER_CRUD_SERVICE_TOKEN,
} from './rockets-server.constants';
import { RocketsServerNotificationService } from './services/rockets-server-notification.service';
import { RocketsServerOtpService } from './services/rockets-server-otp.service';
import { SwaggerUiModule } from '@concepta/nestjs-swagger-ui';
import { ApiTags } from '@nestjs/swagger';
import { RocketsServerAdminModule } from './modules/admin/rockets-server-admin.module';

const RAW_OPTIONS_TOKEN = Symbol('__ROCKETS_SERVER_MODULE_RAW_OPTIONS_TOKEN__');

export const {
  ConfigurableModuleClass: RocketsServerModuleClass,
  OPTIONS_TYPE: ROCKETS_SERVER_MODULE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RocketsServerOptionsInterface>({
  moduleName: 'RocketsServer',
  optionsInjectionToken: RAW_OPTIONS_TOKEN,
})
  .setExtras<RocketsServerOptionsExtrasInterface>(
    {
      global: false },
    definitionTransform,
  )
  .build();

export type RocketsServerOptions = Omit<
  typeof ROCKETS_SERVER_MODULE_OPTIONS_TYPE,
  'global'
>;

export type RocketsServerAsyncOptions = Omit<
  typeof ROCKETS_SERVER_MODULE_ASYNC_OPTIONS_TYPE,
  'global'
>;

/**
 * Transform the definition to include the combined modules
 */
function definitionTransform(
  definition: DynamicModule,
  extras: RocketsServerOptionsExtrasInterface,
): DynamicModule {
  const { imports = [], providers = [], exports = [] } = definition;
  const { controllers, admin } = extras;
  // TODO: need to define this, if set it as required we need to have defaults on extras
  // if (!user?.imports) throw new Error('Make sure imports entities for user');
  // if (!otp?.imports) throw new Error('Make sure imports entities for otp');
  // Federated is optional since OAuth modules are optional
  // if (!federated?.imports) throw new Error('Make sure imports entities for federated');

  // Base module without admin
  const baseModule: DynamicModule = {
    ...definition,
    global: extras.global,
    imports: createRocketsServerImports({ imports, extras }),
    controllers: createRocketsServerControllers({ controllers }) || [],
    providers: [...createRocketsServerProviders({ providers, extras })],
    exports: createRocketsServerExports({ exports, extras }),
  };

  // If admin is configured, add the admin submodule
  if (admin) {
    baseModule.imports = [
      ...(baseModule.imports || []),
      RocketsServerAdminModule.register(admin),
    ];
  }

  return baseModule;
}

export function createRocketsServerControllers(options: {
  controllers?: DynamicModule['controllers'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['controllers'] {
  const controllersPropExists = Object.prototype.hasOwnProperty.call(
    options ?? {},
    'controllers',
  );

  // If controllers is an empty array, return it as-is
  if (controllersPropExists && Array.isArray(options.controllers) && options.controllers.length === 0) {
    return [];
  }

  // Default order A (when controllers is NOT provided at all, or provided and non-empty for append)
  const defaultsOrderA: DynamicModule['controllers'] = [
    AuthPasswordController,
    RocketsServerRecoveryController,
    AuthTokenRefreshController,
    AuthSignupController,
    RocketsServerOtpController,
    RocketsServerUserController,
    AuthOAuthController,
  ];

  // Default order B (when controllers is explicitly undefined)
  const defaultsOrderB: DynamicModule['controllers'] = [
    AuthSignupController,
    RocketsServerUserController,
    AuthPasswordController,
    AuthTokenRefreshController,
    RocketsServerRecoveryController,
    RocketsServerOtpController,
    AuthOAuthController,
  ];

  if (controllersPropExists && options.controllers === undefined) {
    return defaultsOrderB;
  }

  if (controllersPropExists && Array.isArray(options.controllers) && options.controllers.length > 0) {
    return [...(defaultsOrderA || []), ...options.controllers];
  }

  // No controllers property provided
  return defaultsOrderA;
}



export function createRocketsServerSettingsProvider(
  optionsOverrides?: RocketsServerOptionsInterface,
): Provider {
  return createSettingsProvider<
    RocketsServerSettingsInterface,
    RocketsServerOptionsInterface
  >({
    settingsToken: ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
    optionsToken: RAW_OPTIONS_TOKEN,
    settingsKey: authenticationOptionsDefaultConfig.KEY,
    optionsOverrides,
  });
}

/**
 * Create imports for the combined module
 */
export function createRocketsServerImports(options: {
  imports: DynamicModule['imports'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['imports'] {
  // Default Auth Guard Router guards configuration if not provided
  const defaultAuthRouterGuards: AuthRouterGuardConfigInterface[] = [
    { name: 'google', guard: AuthGoogleGuard },
    { name: 'github', guard: AuthGithubGuard },
    { name: 'apple', guard: AuthAppleGuard },
  ];

  const imports: DynamicModule['imports'] = [
    ...(options.imports || []),
    ConfigModule.forFeature(authenticationOptionsDefaultConfig),
    CrudModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          settings: options.crud?.settings,
        };
      },
    }),
    SwaggerUiModule.registerAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          documentBuilder: options.swagger?.documentBuilder,
          settings: options.swagger?.settings,
        };
      },
    }),
    AuthenticationModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          verifyTokenService:
            options.authentication?.verifyTokenService ||
            options.services?.verifyTokenService,
          issueTokenService:
            options.authentication?.issueTokenService ||
            options.services?.issueTokenService,
          validateTokenService:
            options.authentication?.validateTokenService ||
            options.services?.validateTokenService,
          settings: options.authentication?.settings,
        };
      },
    }),
    JwtModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (
        options: RocketsServerOptionsInterface,
      ): JwtOptionsInterface => {
        return {
          jwtIssueTokenService:
            options.jwt?.jwtIssueTokenService ||
            options.services?.issueTokenService,
          jwtVerifyTokenService:
            options.jwt?.jwtVerifyTokenService ||
            options.services?.verifyTokenService,
          jwtRefreshService: options.jwt?.jwtRefreshService,
          jwtAccessService: options.jwt?.jwtAccessService,
          // TODO: This is only used ono apple, need to review
          jwtService: options.jwt?.jwtService,
          settings: options.jwt?.settings,
        };
      },
    }),
    AuthJwtModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN, UserModelService],
      useFactory: (
        options: RocketsServerOptionsInterface,
        userModelService: UserModelService,
      ): AuthJwtOptionsInterface => {
        return {
          appGuard: options.authJwt?.appGuard,
          verifyTokenService:
            options.authJwt?.verifyTokenService ||
            options.services?.verifyTokenService,
          userModelService:
            options.authJwt?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          settings: options.authJwt?.settings,
        };
      },
    }),
    FederatedModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN, UserModelService],
      imports: [...(options.extras?.federated?.imports || [])],
      useFactory: (
        options: RocketsServerOptionsInterface,
        userModelService: UserModelService,
      ): FederatedOptionsInterface => {
        return {
          userModelService:
            options.federated?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          settings: options.federated?.settings,
        };
      },
    }),
    // TODO: should we have a flag to only load if defined?
    AuthAppleModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (
        options: RocketsServerOptionsInterface,
      ): AuthAppleOptionsInterface => {
        return {
          jwtService: options.authApple?.jwtService || options.jwt?.jwtService,
          authAppleService: options.authApple?.authAppleService,
          issueTokenService:
            options.authApple?.issueTokenService ||
            options.services?.issueTokenService,
          settingsTransform: options.authApple?.settingsTransform,
          settings: options.authApple?.settings,
        };
      },
    }),
    AuthGithubModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (
        options: RocketsServerOptionsInterface,
      ): AuthGithubOptionsInterface => {
        return {
          issueTokenService:
            options.authGithub?.issueTokenService ||
            options.services?.issueTokenService,
          settingsTransform: options.authGithub?.settingsTransform,
          settings: options.authGithub?.settings,
        };
      },
    }),
    AuthGoogleModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (
        options: RocketsServerOptionsInterface,
      ): AuthGoogleOptionsInterface => {
        return {
          issueTokenService:
            options.authGoogle?.issueTokenService ||
            options.services?.issueTokenService,
          settingsTransform: options.authGoogle?.settingsTransform,
          settings: options.authGoogle?.settings,
        };
      },
    }),
    AuthRouterModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      guards: options.extras?.authRouter?.guards || defaultAuthRouterGuards,
      useFactory: (
        options: RocketsServerOptionsInterface,
      ): AuthRouterOptionsInterface => {
        return {
          settings: options.authRouter?.settings,
        };
      },
    }),
    AuthRefreshModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN, UserModelService],
      useFactory: (
        options: RocketsServerOptionsInterface,
        userModelService: UserModelService,
      ): AuthRefreshOptionsInterface => {
        return {
          verifyTokenService:
            options.refresh?.verifyTokenService ||
            options.services?.verifyTokenService,
          issueTokenService:
            options.refresh?.issueTokenService ||
            options.services?.issueTokenService,
          userModelService:
            options.refresh?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          settings: options.refresh?.settings,
        };
      },
    }),
    AuthLocalModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN, UserModelService],
      useFactory: (
        options: RocketsServerOptionsInterface,
        userModelService: UserModelService,
      ): AuthLocalOptionsInterface => {
        return {
          passwordValidationService:
            options.authLocal?.passwordValidationService,
          validateUserService:
            options.authLocal?.validateUserService ||
            options.services?.validateUserService,
          issueTokenService:
            options.authLocal?.issueTokenService ||
            options.services?.issueTokenService,
          userModelService:
            options.authLocal?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          settings: options.authLocal?.settings,
        };
      },
    }),
    AuthRecoveryModule.forRootAsync({
      inject: [
        RAW_OPTIONS_TOKEN,
        EmailService,
        OtpService,
        UserModelService,
        UserPasswordService,
      ],
      useFactory: (
        options: RocketsServerOptionsInterface,
        defaultEmailService: EmailService,
        defaultOtpService: OtpService,
        userModelService: UserModelService,
        defaultUserPasswordService: UserPasswordService,
      ): AuthRecoveryOptionsInterface => {
        return {
          // TODO: keep this one using default and user mailer service to define how to send
          emailService: defaultEmailService,
          otpService: defaultOtpService,
          userModelService:
            options.authRecovery?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          userPasswordService:
            options.authRecovery?.userPasswordService ||
            options.services?.userPasswordService ||
            defaultUserPasswordService,
          notificationService:
            options.authRecovery?.notificationService ||
            options.services?.notificationService,
          settings: options.authRecovery?.settings,
        };
      },
    }),
    AuthVerifyModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN, EmailService, UserModelService, OtpService],
      useFactory: (
        options: RocketsServerOptionsInterface,
        defaultEmailService: EmailServiceInterface,
        userModelService: UserModelService,
        defaultOtpService: OtpService,
      ): AuthVerifyOptionsInterface => {
        return {
          emailService: defaultEmailService,
          otpService: defaultOtpService,
          userModelService:
            options.authVerify?.userModelService ||
            options.services?.userModelService ||
            userModelService,
          notificationService:
            options.authVerify?.notificationService ||
            options.services?.notificationService,
          settings: options.authVerify?.settings,
        };
      },
    }),
    PasswordModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          settings: options.password?.settings,
        };
      },
    }),

    UserModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      imports: [...(options.extras?.user?.imports || [])],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          settings: options.user?.settings,
          userModelService:
            options.user?.userModelService ||
            options.services?.userModelService,
          userPasswordService:
            options.user?.userPasswordService ||
            options.services?.userPasswordService,
          userAccessQueryService:
            options.user?.userAccessQueryService ||
            options.services?.userAccessQueryService,
          userPasswordHistoryService:
            options.user?.userPasswordHistoryService ||
            options.services?.userPasswordHistoryService,
        };
      },
    }),
    OtpModule.forRootAsync({
      imports: [...(options.extras?.otp?.imports || [])],
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          settings: options.otp?.settings,
        };
      },
      entities: ['userOtp'],
    }),
    EmailModule.forRootAsync({
      inject: [RAW_OPTIONS_TOKEN],
      useFactory: (options: RocketsServerOptionsInterface) => {
        return {
          settings: options.otp?.settings,
          mailerService:
            options.email?.mailerService || options.services.mailerService,
        };
      },
    }),
    // RoleModule.forRootAsync({
    //   imports: [...(options.extras?.role?.imports || [])],
    //   useFactory: () => ({
    //     settings: {
    //       assignments: {
    //         user: { entityKey: 'userRole' },
    //       },
    //     },
    //   }),
    //   entities: ['userRole'],
    // }),
    // RoleModule.forRootAsync({
    //   useFactory: () => ({
    //     settings: {
    //       assignments: {
    //         user: { entityKey: 'userRole' },
    //       },
    //     },
    //   }),
    // }),
  ];

  return imports;
}

/**
 * Create exports for the combined module
 */
export function createRocketsServerExports(options: {
  exports: DynamicModule['exports'];
  extras?: RocketsServerOptionsExtrasInterface;
}): DynamicModule['exports'] {
  return [
    ...(options.exports || []),
    ConfigModule,
    RAW_OPTIONS_TOKEN,
    JwtModule,
    AuthJwtModule,
    AuthAppleModule,
    AuthGithubModule,
    AuthGoogleModule,
    AuthRouterModule,
    AuthRefreshModule,
    FederatedModule,
    SwaggerUiModule,
  ];
}

/**
 * Create providers for the combined module
 */
export function createRocketsServerProviders(options: {
  providers?: Provider[];
  extras?: RocketsServerOptionsExtrasInterface;
}): Provider[] {
  return [
    ...(options.providers ?? []),
    {
      provide: RocketsServerUserLookupService,
      inject: [RAW_OPTIONS_TOKEN, UserModelService],
      useFactory: async (
        options: RocketsServerOptionsInterface,
        userModelService: UserModelService,
      ) => {
        return options.services.userModelService || userModelService;
      },
    },
    RocketsServerOtpService,
    RocketsServerNotificationService,
    createRocketsServerSettingsProvider(),
  ];
}

/**
 * Create admin CRUD providers based on the admin entity configuration
 * This function creates dynamic providers for admin CRUD operations
 */
export function createAdminCrudBuilder(options: {
  admin: AdminOptionsExtrasInterface;
}) {

// If admin entity is configured, create dynamic admin CRUD providers

  const entity = options.admin.entity;
  
  //Create the CRUD builder with the configured entity and DTOs
  const builder = new AdminUserCrudBuilder({
    service: {
      adapter: options.admin.adapter,
      injectionToken: ADMIN_USER_CRUD_SERVICE_TOKEN,
    },
    controller: {
      path: 'admin/users',
      model: {
        type: entity,
      },
      extraDecorators: [ApiTags('admin-users')],
    },
    getMany: {},
    getOne: {},
    createOne: {
      dto: options.admin.dto?.createOne || entity,
    },
    createMany: {
      dto: options.admin.dto?.createMany || entity,
    },
    updateOne: {
      dto: options.admin.dto?.updateOne || entity,
    },
    replaceOne: {
      dto: options.admin.dto?.replaceOne || entity,
    },
    deleteOne: {},
  });

  return builder;
  // const { ConfigurableControllerClass, ConfigurableServiceProvider } = builder.build();
  
  // return {
  //   controller: ConfigurableControllerClass,
  //   service: ConfigurableServiceProvider,
  // }
}
