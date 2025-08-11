import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { RoleService } from '@concepta/nestjs-role';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    try {
      // Check if user has admin role using RoleService
      // You can configure the admin role ID based on your setup
      const adminRoleId = process.env.ADMIN_ROLE_ID || '69397801-8254-418d-8d2d-fbd9ece4c671';
      
      const isAdmin = await this.roleService.isAssignedRole({
        assignment: 'user',
        role: { id: adminRoleId },
        assignee: { id: user.id },
      });

      if (!isAdmin) {
        throw new ForbiddenException('Admin access required');
      }

      return true;
    } catch (error) {
      // If there's an error checking roles (e.g., role doesn't exist), deny access
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      // Log the error for debugging but don't expose it to the client
      console.error('Error checking admin role:', error);
      throw new ForbiddenException('Admin access required');
    }
  }
} 