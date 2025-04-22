import { UserMutateService, UserLookupService } from '@concepta/nestjs-user';
import { UserUpdateDto } from '@concepta/nestjs-user';
import { UserEntityInterface } from '@concepta/nestjs-user';
export declare class AuthUserController {
    private readonly userMutateService;
    private readonly userLookupService;
    constructor(userMutateService: UserMutateService, userLookupService: UserLookupService);
    findById(id: string): Promise<UserEntityInterface | null>;
    update(id: string, userUpdateDto: UserUpdateDto): Promise<UserEntityInterface>;
}
//# sourceMappingURL=auth-user.controller.d.ts.map