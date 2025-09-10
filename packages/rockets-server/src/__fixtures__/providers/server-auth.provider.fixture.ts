import { Injectable } from '@nestjs/common';
import { AuthProviderInterface } from '../../interfaces/auth-provider.interface';
import { AuthorizedUser } from '../../interfaces/auth-user.interface';

@Injectable()
export class ServerAuthProviderFixture implements AuthProviderInterface {
  async verifyToken(bearerToken: string): Promise<AuthorizedUser> {
    // pretend local JWT verification
    const payload: any = { sub: 'serverauth-user-1', email: 'serverauth@example.com', roles: ['admin'] };
    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      claims: payload,
    };
  }

  async getUserBySubject(subject: string): Promise<{ id: string } | null> {
    return { id: subject };
  }

  getProviderInfo() {
    return { name: 'server-auth-fixture', type: 'server-auth' as const, version: 'fixture' };
  }
}


