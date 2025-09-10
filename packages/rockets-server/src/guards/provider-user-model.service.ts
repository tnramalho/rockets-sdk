import { Global, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProviderInterface } from '../interfaces/auth-provider.interface';
import { RocketsServerAuthProvider } from '../rockets-server.constants';

@Global()
  @Injectable()
  //todo: rename authProviderUserService
export class ProviderUserModelService {
  constructor(
    @Inject(RocketsServerAuthProvider)
    private readonly provider: AuthProviderInterface,
  ) {}

  // TODO: map roles with rockets roles
  async bySubject(sub: string): Promise<{ id: string }> {
    const result = await this.provider.getUserBySubject(sub);
    if (!result) {
      // In auth context, missing subject should be treated as unauthorized
      throw new UnauthorizedException('Invalid authentication subject');
    }
    return result;
  }
}


