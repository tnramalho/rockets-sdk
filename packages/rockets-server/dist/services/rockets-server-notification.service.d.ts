import { EmailSendInterface } from '@concepta/nestjs-common';
import { RocketsServerSettingsInterface } from '../interfaces/rockets-server-settings.interface';
import { RocketsServerOtpNotificationServiceInterface } from '../interfaces/rockets-server-otp-notification-service.interface';
export interface RocketsServerOtpEmailParams {
    email: string;
    passcode: string;
}
export declare class RocketsServerNotificationService implements RocketsServerOtpNotificationServiceInterface {
    private readonly settings;
    private readonly emailService;
    constructor(settings: RocketsServerSettingsInterface, emailService: EmailSendInterface);
    sendOtpEmail(params: RocketsServerOtpEmailParams): Promise<void>;
}
//# sourceMappingURL=rockets-server-notification.service.d.ts.map