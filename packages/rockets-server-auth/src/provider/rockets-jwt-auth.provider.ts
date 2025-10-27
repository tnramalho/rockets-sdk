import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { VerifyTokenService } from '@concepta/nestjs-authentication';
import { UserModelService } from '@concepta/nestjs-user';
import { UserEntityInterface } from '@concepta/nestjs-common';
import { RoleService, RoleModelService } from '@concepta/nestjs-role';

@Injectable()
export class RocketsJwtAuthProvider {
  private readonly logger = new Logger(RocketsJwtAuthProvider.name);

  constructor(
    @Inject(VerifyTokenService)
    private readonly verifyTokenService: VerifyTokenService,
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
    @Inject(RoleService)
    private readonly roleService: RoleService,
    @Inject(RoleModelService)
    private readonly roleModelService: RoleModelService,
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
      // Get assigned role IDs
      const assignedRoleIds = await this.roleService.getAssignedRoles({
        assignment: 'user',
        assignee: {
          id: user.id,
        },
      });

      // Fetch full role entities to get role names
      let roleNames: string[] = [];
      if (assignedRoleIds && assignedRoleIds.length > 0) {
        const roleIds = assignedRoleIds.map((role) => role.id);
        const roles = await this.roleModelService.find({
          where: roleIds.map((id) => ({ id })),
        });
        roleNames = roles.map((role) => role.name);
      }

      const authorizedUser = {
        id: user.id,
        sub: payload.sub, // Use sub from JWT payload
        email: user.email,
        userRoles: roleNames.map((name) => ({ role: { name } })),
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
