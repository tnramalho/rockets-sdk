import {
  ReferenceIdInterface,
  RuntimeException,
} from '@concepta/nestjs-common';
import { OtpException, OtpService } from '@concepta/nestjs-otp';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RocketsAuthUserModelServiceInterface } from '../../../shared/interfaces/rockets-auth-user-model-service.interface';
import {
  ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN,
  RocketsAuthUserModelService,
} from '../../../shared/constants/rockets-auth.constants';

import { RocketsAuthOtpNotificationServiceInterface } from '../interfaces/rockets-auth-otp-notification-service.interface';
import { RocketsAuthOtpServiceInterface } from '../interfaces/rockets-auth-otp-service.interface';
import { RocketsAuthSettingsInterface } from '../../../shared/interfaces/rockets-auth-settings.interface';
import { RocketsAuthNotificationService } from './rockets-auth-notification.service';
import { RocketsAuthException } from '../../../shared/exceptions/rockets-auth.exception';
import { logAndGetErrorDetails } from '../../../shared/utils/error-logging.helper';

@Injectable()
export class RocketsAuthOtpService implements RocketsAuthOtpServiceInterface {
  private readonly logger = new Logger(RocketsAuthOtpService.name);

  constructor(
    @Inject(ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN)
    private readonly settings: RocketsAuthSettingsInterface,
    @Inject(RocketsAuthUserModelService)
    private readonly userModelService: RocketsAuthUserModelServiceInterface,
    private readonly otpService: OtpService,
    @Inject(RocketsAuthNotificationService)
    private readonly otpNotificationService: RocketsAuthOtpNotificationServiceInterface,
  ) {}

  async sendOtp(email: string): Promise<void> {
    try {
      // Find user by email
      const user = await this.userModelService.byEmail(email);
      const { assignment, category, expiresIn } = this.settings.otp;

      if (user) {
        // Generate OTP
        const otp = await this.otpService.create({
          assignment,
          otp: {
            category,
            type: 'uuid',
            assigneeId: user.id,
            expiresIn: expiresIn, // 1 hour expiration
          },
        });

        // Send email with OTP
        await this.otpNotificationService.sendOtpEmail({
          email,
          passcode: otp.passcode,
        });

        // Log success for audit trail
        this.logger.log('OTP sent successfully', {
          category,
          expiresIn,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Log attempts for security monitoring (don't log email)
        this.logger.log('OTP request for non-existent user');
      }
    } catch (error) {
      // Log error for observability (NestJS filters will handle HTTP response)
      const { errorMessage } = logAndGetErrorDetails(
        error,
        this.logger,
        'OTP send failed',
        { errorId: 'OTP_SEND_FAILED' },
      );

      if (error instanceof RuntimeException) {
        throw error;
      } else {
        throw new RocketsAuthException(errorMessage);
      }
    }
    // Always return void for security (don't reveal if user exists)
  }

  async confirmOtp(
    email: string,
    passcode: string,
  ): Promise<ReferenceIdInterface> {
    const { assignment, category } = this.settings.otp;
    // Find user by email
    const user = await this.userModelService.byEmail(email);

    if (!user) {
      throw new OtpException();
    }

    // Validate OTP
    const isValid = await this.otpService.validate(
      assignment,
      {
        category: category,
        passcode,
      },
      true,
    );

    if (!isValid) {
      throw new OtpException();
    }

    return user;
  }
}
