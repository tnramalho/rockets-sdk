import { AuthRecoveryServiceInterface } from '@concepta/nestjs-auth-recovery';
import { RocketsServerRecoverLoginDto } from '../../dto/auth/rockets-server-recover-login.dto';
import { RocketsServerRecoverPasswordDto } from '../../dto/auth/rockets-server-recover-password.dto';
import { RocketsServerUpdatePasswordDto } from '../../dto/auth/rockets-server-update-password.dto';
export declare class RocketsServerRecoveryController {
    private readonly authRecoveryService;
    constructor(authRecoveryService: AuthRecoveryServiceInterface);
    recoverLogin(recoverLoginDto: RocketsServerRecoverLoginDto): Promise<void>;
    recoverPassword(recoverPasswordDto: RocketsServerRecoverPasswordDto): Promise<void>;
    validatePasscode(passcode: string): Promise<void>;
    updatePassword(updatePasswordDto: RocketsServerUpdatePasswordDto): Promise<void>;
}
//# sourceMappingURL=auth-recovery.controller.d.ts.map