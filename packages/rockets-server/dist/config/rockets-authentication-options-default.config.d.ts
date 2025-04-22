import { AuthenticationSettingsInterface } from '@concepta/nestjs-authentication/dist/interfaces/authentication-settings.interface';
import { JwtSettingsInterface } from '@concepta/nestjs-jwt/dist/interfaces/jwt-settings.interface';
import { AuthJwtSettingsInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-settings.interface';
import { AuthRefreshSettingsInterface } from '@concepta/nestjs-auth-refresh/dist/interfaces/auth-refresh-settings.interface';
export declare const authenticationOptionsDefaultConfig: (() => {
    authentication: AuthenticationSettingsInterface;
    jwt: JwtSettingsInterface;
    authJwt: AuthJwtSettingsInterface;
    refresh: AuthRefreshSettingsInterface;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    authentication: AuthenticationSettingsInterface;
    jwt: JwtSettingsInterface;
    authJwt: AuthJwtSettingsInterface;
    refresh: AuthRefreshSettingsInterface;
}>;
//# sourceMappingURL=rockets-authentication-options-default.config.d.ts.map