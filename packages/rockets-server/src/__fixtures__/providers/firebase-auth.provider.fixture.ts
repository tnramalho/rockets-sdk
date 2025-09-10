import { Injectable } from '@nestjs/common';
import { AuthProviderInterface } from '../../interfaces/auth-provider.interface';
import { AuthorizedUser } from '../../interfaces/auth-user.interface';

@Injectable()
export class FirebaseAuthProviderFixture implements AuthProviderInterface {
  async verifyToken(bearerToken: string): Promise<AuthorizedUser> {
    // pretend validate against Firebase and decode claims
    const decoded: any = { sub: 'firebase-user-1', email: 'firebase@example.com', roles: ['user'] };
    return {
      sub: decoded.sub,
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      claims: decoded,
    };
  }

  async getUserBySubject(subject: string): Promise<{ id: string } | null> {
    return { id: subject };
  }

  getProviderInfo() {
    return { name: 'firebase-fixture', type: 'firebase' as const, version: 'fixture' };
  }
}


