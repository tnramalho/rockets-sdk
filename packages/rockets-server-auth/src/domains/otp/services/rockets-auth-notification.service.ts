import { Injectable, Inject } from '@nestjs/common';
import { EmailSendInterface } from '@concepta/nestjs-common';
import { EmailService } from '@concepta/nestjs-email';
import { RocketsAuthSettingsInterface } from '../../../shared/interfaces/rockets-auth-settings.interface';
import { ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from '../../../shared/constants/rockets-auth.constants';
import { RocketsAuthOtpNotificationServiceInterface } from '../interfaces/rockets-auth-otp-notification-service.interface';

export interface RocketsAuthOtpEmailParams {
  email: string;
  passcode: string;
}

@Injectable()
export class RocketsAuthNotificationService
  implements RocketsAuthOtpNotificationServiceInterface
{
  constructor(
    @Inject(ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN)
    private readonly settings: RocketsAuthSettingsInterface,
    @Inject(EmailService)
    private readonly emailService: EmailSendInterface,
  ) {}

  async sendOtpEmail(params: RocketsAuthOtpEmailParams): Promise<void> {
    const { email, passcode } = params;
    const { fileName, subject } = this.settings.email.templates.sendOtp;
    const { from, baseUrl } = this.settings.email;

    await this.emailService.sendMail({
      to: email,
      from,
      subject,
      template: fileName,
      context: {
        passcode,
        tokenUrl: `${baseUrl}/${passcode}`,
      },
    });
  }
}
