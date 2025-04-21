import { IssueTokenServiceInterface } from '@concepta/nestjs-authentication';
import { RocketsServerOtpConfirmDto } from '../../dto/rockets-server-otp-confirm.dto';
import { RocketsServerOtpSendDto } from '../../dto/rockets-server-otp-send.dto';
import { RocketsServerAuthenticationResponseInterface } from '../../interfaces/common/rockets-server-authentication-response.interface';
import { RocketsServerOtpService } from '../../services/rockets-server-otp.service';
export declare class RocketsServerOtpController {
    private issueTokenService;
    private readonly otpService;
    constructor(issueTokenService: IssueTokenServiceInterface, otpService: RocketsServerOtpService);
    sendOtp(dto: RocketsServerOtpSendDto): Promise<void>;
    confirmOtp(dto: RocketsServerOtpConfirmDto): Promise<RocketsServerAuthenticationResponseInterface>;
}
//# sourceMappingURL=rockets-server-otp.controller.d.ts.map