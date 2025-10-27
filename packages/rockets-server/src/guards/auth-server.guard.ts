import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthProviderInterface } from '../interfaces/auth-provider.interface';
import { AuthorizedUser } from '../interfaces/auth-user.interface';
import { RocketsAuthProvider } from '../rockets.constants';
import { AUTHENTICATION_MODULE_DISABLE_GUARDS_TOKEN } from '@concepta/nestjs-authentication';

@Injectable()
export class AuthServerGuard implements CanActivate {
  constructor(
    @Inject(RocketsAuthProvider)
    private readonly authProvider: AuthProviderInterface,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get the context handler and class
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    // check if guards are disabled on the handler or class
    const isDisabled = this.reflector.getAllAndOverride<boolean>(
      AUTHENTICATION_MODULE_DISABLE_GUARDS_TOKEN,
      [contextHandler, contextClass],
    );

    // disabled via context?
    if (isDisabled === true) {
      // yes, immediate activation
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify the token using the auth provider directly
      const user: AuthorizedUser = await this.authProvider.validateToken(token);

      // Attach user to request for use in controllers (this makes @AuthUser() work)
      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: {
    headers?: { authorization?: string };
  }): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
