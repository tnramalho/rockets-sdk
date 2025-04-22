import { UserMutateService, UserLookupService } from '@concepta/nestjs-user';
import { RocketsServerUserUpdateDto } from '../../dto/user/rockets-server-user-update.dto';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
export declare class RocketsServerUserController {
    private readonly userMutateService;
    private readonly userLookupService;
    constructor(userMutateService: UserMutateService, userLookupService: UserLookupService);
    findById(id: string): Promise<RocketsServerUserEntityInterface | null>;
    update(id: string, userUpdateDto: RocketsServerUserUpdateDto): Promise<RocketsServerUserEntityInterface>;
}
//# sourceMappingURL=rockets-server-user.controller.d.ts.map