import { UserEntitiesOptionsInterface } from '@concepta/nestjs-user/dist/interfaces/user-entities-options.interface';
import { DynamicModule } from '@nestjs/common';
export interface RocketsAuthenticationOptionsExtrasInterface extends Pick<DynamicModule, 'global' | 'controllers'>, Partial<UserEntitiesOptionsInterface> {
}
//# sourceMappingURL=rockets-authentication-options-extras.interface.d.ts.map