import { RocketsServerUserInterface } from '../../interfaces/common/rockets-server-user.interface';
import { RocketsServerAuthenticationResponseInterface } from '../../interfaces/common/rockets-server-authentication-response.interface';
import { IssueTokenServiceInterface } from '@concepta/nestjs-authentication';
export declare class AuthTokenRefreshController {
    private issueTokenService;
    constructor(issueTokenService: IssueTokenServiceInterface);
    refresh(user: RocketsServerUserInterface): Promise<RocketsServerAuthenticationResponseInterface>;
}
//# sourceMappingURL=auth-refresh.controller.d.ts.map