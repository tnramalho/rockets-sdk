import { AuthorizedUser } from './auth-user.interface';

export interface AuthProviderInterface {
  verifyToken(token: string): Promise<AuthorizedUser>;
  getUserBySubject(subject: string): Promise<{ id: string } | null>;
  getProviderInfo(): { name: string; type: 'server-auth' | 'firebase' | 'auth0' | 'custom'; version?: string };
}


