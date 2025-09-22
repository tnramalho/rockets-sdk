import { DynamicModule } from '@nestjs/common';

/**
 * Rockets Server module extras interface
 */
export interface RocketsServerOptionsExtrasInterface
  extends Pick<DynamicModule, 'global' | 'controllers'> {
  /**
   * Enable global auth guard
   * When true, registers AuthGuard as APP_GUARD globally
   * When false, only provides AuthGuard as a service (not global)
   * Default: true
   */
  enableGlobalGuard?: boolean;
}
