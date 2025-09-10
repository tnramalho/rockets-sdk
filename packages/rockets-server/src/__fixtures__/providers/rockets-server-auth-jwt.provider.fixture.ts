import { Injectable } from '@nestjs/common';
import { JwtVerifyAccessTokenInterface } from '@concepta/nestjs-jwt';
import { AuthProviderInterface } from '../../interfaces/auth-provider.interface';
import { AuthorizedUser } from '../../interfaces/auth-user.interface';

/**
 * Auth provider fixture that validates JWT tokens issued by RocketsServerAuth
 * This demonstrates how RocketsServer can integrate with RocketsServerAuth tokens
 * TODO: export this from ServerAuth
 */
@Injectable()
export class RocketsServerAuthJwtProviderFixture implements AuthProviderInterface {
  constructor(private readonly verifyTokenService: JwtVerifyAccessTokenInterface) {}

  async verifyToken(token: string): Promise<AuthorizedUser> {
    try {
      // Remove 'Bearer ' prefix if present
      //const token = bearerToken.replace(/^Bearer\s+/i, '');
      
      // Verify and decode the JWT token using the same secret as RocketsServerAuth
      const payload = await this.verifyTokenService.accessToken(token) as AuthorizedUser;

      // Return user info from JWT payload in the format expected by RocketsServer
      return {
        id: payload.sub,
        sub: payload.sub,
        email: payload.email || payload.sub + '@example.com',
        roles: payload.roles || ['user'],
      };
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  async getUserBySubject(subject: string): Promise<{ id: string } | null> {
    // For JWT tokens, we don't have a persistent user store in this fixture
    // In a real implementation, this would query the user database
    return { id: subject };
  }

  getProviderInfo() {
    return { 
      name: 'rockets-server-auth-jwt-fixture', 
      type: 'server-auth' as const, 
      version: '1.0.0' 
    };
  }
}