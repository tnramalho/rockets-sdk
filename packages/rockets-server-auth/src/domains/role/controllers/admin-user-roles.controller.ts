import { RoleService } from '@concepta/nestjs-role';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../../guards/admin.guard';

class AdminAssignUserRoleDto {
  roleId!: string;
}

@UseGuards(AdminGuard)
@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin/users/:userId/roles')
export class AdminUserRolesController {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @ApiOperation({ summary: 'List roles assigned to a user' })
  @ApiParam({ name: 'userId', required: true })
  @ApiOkResponse({ description: 'Roles for the user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('')
  async list(@Param('userId') userId: string) {
    return this.roleService.getAssignedRoles({
      assignment: 'user',
      assignee: { id: userId },
    });
  }

  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiParam({ name: 'userId', required: true })
  @ApiCreatedResponse({ description: 'Role assigned' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('')
  async assign(
    @Param('userId') userId: string,
    @Body() dto: AdminAssignUserRoleDto,
  ) {
    await this.roleService.assignRole({
      assignment: 'user',
      assignee: { id: userId },
      role: { id: dto.roleId },
    });
  }

  // Note: Current RoleService API does not expose unassign method.
}
