import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { OtpService } from '@concepta/nestjs-otp';
import { RocketsServerUserLookupServiceInterface } from '../interfaces/rockets-server-user-lookup-service.interface';
import { RocketsServerOtpNotificationServiceInterface } from '../interfaces/rockets-server-otp-notification-service.interface';
import { RocketsServerOtpServiceInterface } from '../interfaces/rockets-server-otp-service.interface';
import { RocketsServerSettingsInterface } from '../interfaces/rockets-server-settings.interface';
export declare class RocketsServerOtpService implements RocketsServerOtpServiceInterface {
    private readonly settings;
    private readonly userLookupService;
    private readonly otpService;
    private readonly otpNotificationService;
    constructor(settings: RocketsServerSettingsInterface, userLookupService: RocketsServerUserLookupServiceInterface, otpService: OtpService, otpNotificationService: RocketsServerOtpNotificationServiceInterface);
    sendOtp(email: string): Promise<void>;
    confirmOtp(email: string, passcode: string): Promise<ReferenceIdInterface>;
}
//# sourceMappingURL=rockets-server-otp.service.d.ts.map