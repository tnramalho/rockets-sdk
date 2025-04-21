import { DynamicModule } from '@nestjs/common';
import { AuthenticationCombinedAsyncOptions, AuthenticationCombinedOptions, AuthenticationModuleClass } from './rockets-authentication.module-definition';
export declare class RocketsAuthenticationModule extends AuthenticationModuleClass {
    static forRoot(options: AuthenticationCombinedOptions): DynamicModule;
    static forRootAsync(options: AuthenticationCombinedAsyncOptions): DynamicModule;
}
//# sourceMappingURL=rockets-authentication.module.d.ts.map