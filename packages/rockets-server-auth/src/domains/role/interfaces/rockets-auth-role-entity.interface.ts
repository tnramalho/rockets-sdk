import { RoleEntityInterface } from '@concepta/nestjs-common';
import { RocketsAuthRoleInterface } from './rockets-auth-role.interface';

/**
 * Rockets Server Role Entity Interface
 *
 * Extends the base role entity interface and rockets role interface
 */
export interface RocketsAuthRoleEntityInterface
  extends RoleEntityInterface,
    RocketsAuthRoleInterface {}
