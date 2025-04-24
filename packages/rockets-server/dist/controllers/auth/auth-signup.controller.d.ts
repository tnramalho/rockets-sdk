import { UserModelService } from '@concepta/nestjs-user';
import { RocketsServerUserCreateDto } from '../../dto/user/rockets-server-user-create.dto';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
export declare class AuthSignupController {
    private readonly userModelService;
    constructor(userModelService: UserModelService);
    create(userCreateDto: RocketsServerUserCreateDto): Promise<RocketsServerUserEntityInterface>;
}
//# sourceMappingURL=auth-signup.controller.d.ts.map