import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { OtpService } from '@concepta/nestjs-otp';
import { RocketsServerUserModelServiceInterface } from '../interfaces/rockets-server-user-model-service.interface';
import { RocketsServerOtpNotificationServiceInterface } from '../interfaces/rockets-server-otp-notification-service.interface';
import { RocketsServerOtpServiceInterface } from '../interfaces/rockets-server-otp-service.interface';
import { RocketsServerSettingsInterface } from '../interfaces/rockets-server-settings.interface';
export declare class RocketsServerOtpService implements RocketsServerOtpServiceInterface {
    private readonly settings;
    private readonly userModelService;
    private readonly otpService;
    private readonly otpNotificationService;
    constructor(settings: RocketsServerSettingsInterface, userModelService: RocketsServerUserModelServiceInterface, otpService: OtpService, otpNotificationService: RocketsServerOtpNotificationServiceInterface);
    sendOtp(email: string): Promise<void>;
    confirmOtp(email: string, passcode: string): Promise<ReferenceIdInterface>;
}
//# sourceMappingURL=rockets-server-otp.service.d.ts.map