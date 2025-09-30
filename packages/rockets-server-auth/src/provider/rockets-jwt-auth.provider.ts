import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { VerifyTokenService } from '@concepta/nestjs-authentication';
import { UserModelService } from '@concepta/nestjs-user';
import { UserEntityInterface } from '@concepta/nestjs-common';
import { RoleService } from '@concepta/nestjs-role';

@Injectable()
export class RocketsJwtAuthProvider {
  private readonly logger = new Logger(RocketsJwtAuthProvider.name);

  constructor(
    @Inject(VerifyTokenService)
    private readonly verifyTokenService: VerifyTokenService,
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
    @Inject(RoleService)
    private readonly roleModelService: RoleService,
  ) {}

  async validateToken(token: string) {
    try {
      const payload: { sub?: string; roles?: string[] } =
        await this.verifyTokenService.accessToken(token);

      if (!payload || !payload.sub) {
        this.logger.warn('Invalid token payload - missing sub claim');
        throw new UnauthorizedException('Invalid token payload');
      }

      const user: UserEntityInterface | null =
        await this.userModelService.bySubject(payload.sub);

      if (!user) {
        this.logger.warn(`User not found for subject: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }
      const roles = await this.roleModelService.getAssignedRoles({
        assignment: 'user',
        assignee: {
          id: user.id,
        },
      });
      const rolesString = roles.map((role) => role.id);

      const authorizedUser = {
        id: user.id,
        sub: payload.sub, // Use sub from JWT payload
        email: user.email,
        roles: rolesString || [], // Use roles from JWT payload
        claims: {
          // Include any custom claims from the JWT
          ...payload,
        },
      };

      this.logger.log(`Successfully validated token for user: ${payload.sub}`);
      return authorizedUser;
    } catch (error) {
      // Log the error but don't expose internal details
      this.logger.error(`Token validation failed: ${error || 'Unknown error'}`);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // For any other errors, return a generic unauthorized message
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
