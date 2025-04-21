import { DynamicModule } from '@nestjs/common';
import { RocketsServerEntitiesOptionsInterface } from './rockets-server-entities-options.interface';
export interface RocketsServerOptionsExtrasInterface extends Pick<DynamicModule, 'global' | 'controllers'>, Partial<RocketsServerEntitiesOptionsInterface> {
}
//# sourceMappingURL=rockets-server-options-extras.interface.d.ts.map