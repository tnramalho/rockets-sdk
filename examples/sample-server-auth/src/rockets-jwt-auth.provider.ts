import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { VerifyTokenService } from '@concepta/nestjs-authentication';
import { UserModelService } from '@concepta/nestjs-user';
import { AuthProviderInterface, AuthorizedUser } from '@bitwild/rockets-server';

@Injectable()
export class RocketsJwtAuthProvider implements AuthProviderInterface {
  private readonly logger = new Logger(RocketsJwtAuthProvider.name);

  constructor(
    @Inject(VerifyTokenService)
    private readonly verifyTokenService: VerifyTokenService,
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
  ) {}

  async validateToken(token: string): Promise<AuthorizedUser> {
    try {
      // 1. Verificar o token JWT usando o VerifyTokenService
      const payload = await this.verifyTokenService.accessToken(token) as any;
      
      if (!payload || !payload.sub) {
        this.logger.warn('Invalid token payload - missing sub claim');
        throw new UnauthorizedException('Invalid token payload');
      }

      // 2. Buscar o usuário no banco pelo subject (sub) usando UserModelService
      const user = await this.userModelService.bySubject(payload.sub);
      
      if (!user) {
        this.logger.warn(`User not found for subject: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      // 3. Retornar o AuthorizedUser no formato esperado
      const authorizedUser: AuthorizedUser = {
        id: user.id,
        sub: payload.sub, // Use sub from JWT payload
        email: user.email || payload.email || 'unknown@example.com',
        roles: payload.roles || [], // Use roles from JWT payload
        claims: {
          username: user.username || payload.username || payload.sub,
          iat: payload.iat,
          exp: payload.exp,
          // Include any custom claims from the JWT
          ...payload,
        },
      };

      this.logger.log(`Successfully validated token for user: ${payload.sub}`);
      return authorizedUser;

    } catch (error: any) {
      // Log the error but don't expose internal details
      this.logger.error(`Token validation failed: ${error?.message || 'Unknown error'}`);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For any other errors, return a generic unauthorized message
      throw new UnauthorizedException('Token validation failed');
    }
  }
}