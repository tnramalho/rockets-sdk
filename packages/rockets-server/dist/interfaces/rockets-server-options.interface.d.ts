import { AuthJwtOptionsInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-options.interface';
import { AuthRefreshOptions } from '@concepta/nestjs-auth-refresh/dist/auth-refresh.module-definition';
import { ValidateTokenServiceInterface } from '@concepta/nestjs-authentication/dist/interfaces/validate-token-service.interface';
import { CanAccess } from '@concepta/nestjs-access-control';
import { AuthLocalValidateUserServiceInterface } from '@concepta/nestjs-auth-local';
import { AuthLocalOptionsInterface } from '@concepta/nestjs-auth-local/dist/interfaces/auth-local-options.interface';
import { AuthRecoveryOptionsInterface } from '@concepta/nestjs-auth-recovery/dist/interfaces/auth-recovery-options.interface';
import { AuthVerifyOptionsInterface } from '@concepta/nestjs-auth-verify/dist/interfaces/auth-verify-options.interface';
import { AuthenticationOptionsInterface, IssueTokenServiceInterface, VerifyTokenService } from '@concepta/nestjs-authentication';
import { EmailOptionsInterface, EmailServiceInterface } from '@concepta/nestjs-email';
import { JwtOptions } from '@concepta/nestjs-jwt/dist/jwt.module-definition';
import { OtpOptionsInterface } from '@concepta/nestjs-otp';
import { PasswordOptionsInterface } from '@concepta/nestjs-password';
import { TypeOrmExtOptions } from '@concepta/nestjs-typeorm-ext';
import { UserPasswordServiceInterface } from '@concepta/nestjs-user';
import { UserOptionsInterface } from '@concepta/nestjs-user/dist/interfaces/user-options.interface';
import { UserPasswordHistoryServiceInterface } from '@concepta/nestjs-user/dist/interfaces/user-password-history-service.interface';
import { RocketsServerNotificationServiceInterface } from './rockets-server-notification.service.interface';
import { RocketsServerSettingsInterface } from './rockets-server-settings.interface';
import { RocketsServerUserModelServiceInterface } from './rockets-server-user-model-service.interface';
export interface RocketsServerOptionsInterface {
    settings?: RocketsServerSettingsInterface;
    authentication?: AuthenticationOptionsInterface;
    jwt?: JwtOptions;
    authJwt?: AuthJwtOptionsInterface;
    authLocal?: AuthLocalOptionsInterface;
    authRecovery?: AuthRecoveryOptionsInterface;
    refresh?: AuthRefreshOptions;
    authVerify?: AuthVerifyOptionsInterface;
    user?: UserOptionsInterface;
    password?: PasswordOptionsInterface;
    typeorm: TypeOrmExtOptions;
    otp?: OtpOptionsInterface;
    email?: Partial<EmailOptionsInterface>;
    services: {
        userModelService?: RocketsServerUserModelServiceInterface;
        notificationService?: RocketsServerNotificationServiceInterface;
        verifyTokenService?: VerifyTokenService;
        issueTokenService?: IssueTokenServiceInterface;
        validateTokenService?: ValidateTokenServiceInterface;
        validateUserService?: AuthLocalValidateUserServiceInterface;
        userPasswordService?: UserPasswordServiceInterface;
        userPasswordHistoryService?: UserPasswordHistoryServiceInterface;
        userAccessQueryService?: CanAccess;
        mailerService: EmailServiceInterface;
    };
}
//# sourceMappingURL=rockets-server-options.interface.d.ts.map