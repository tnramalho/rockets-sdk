import { Global, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { VerifyTokenServiceInterface } from '@concepta/nestjs-authentication';
import type { NestJwtService } from '@concepta/nestjs-jwt/dist/jwt.externals';
import { AuthProviderInterface } from '../interfaces/auth-provider.interface';
import { AuthorizedUser } from '../interfaces/auth-user.interface';
import { RocketsServerAuthProvider } from '../rockets-server.constants';

// TODO: Update on rockets VerifyTokenServiceInterface to only need access token we dont need refresh for AuthJWT
@Global()
@Injectable()
export class ProviderVerifyTokenService implements VerifyTokenServiceInterface {
  constructor(
    @Inject(RocketsServerAuthProvider)
    private readonly provider: AuthProviderInterface,
  ) {}

  // TODO: Map of the roles
  async validate(token: string): Promise<AuthorizedUser> {
    try {
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }
      return await this.provider.verifyToken(token);
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  // Required by VerifyTokenServiceInterface
  async accessToken(
    ...args: Parameters<NestJwtService['verifyAsync']>
  ): ReturnType<NestJwtService['verifyAsync']> {
    const tokenArg = args[0];
    const token = typeof tokenArg === 'string' ? tokenArg : String(tokenArg);
    return this.validate(token) as unknown as ReturnType<NestJwtService['verifyAsync']>;
  }

  async refreshToken(
    ...args: Parameters<NestJwtService['verifyAsync']>
  ): ReturnType<NestJwtService['verifyAsync']> {
    const tokenArg = args[0];
    const token = typeof tokenArg === 'string' ? tokenArg : String(tokenArg);
    return this.validate(token) as unknown as ReturnType<NestJwtService['verifyAsync']>;
  }
}


