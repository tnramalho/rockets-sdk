import { IssueTokenServiceInterface } from '@concepta/nestjs-authentication';
import { RocketsServerAuthenticationResponseInterface } from '../../interfaces/common/rockets-server-authentication-response.interface';
import { RocketsServerUserInterface } from '../../interfaces/common/rockets-server-user.interface';
export declare class AuthPasswordController {
    private issueTokenService;
    constructor(issueTokenService: IssueTokenServiceInterface);
    login(user: RocketsServerUserInterface): Promise<RocketsServerAuthenticationResponseInterface>;
}
//# sourceMappingURL=auth-password.controller.d.ts.map