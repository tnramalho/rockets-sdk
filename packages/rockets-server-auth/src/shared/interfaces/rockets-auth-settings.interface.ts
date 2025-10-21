import { RocketsAuthOtpSettingsInterface } from '../../domains/otp/interfaces/rockets-auth-otp-settings.interface';

/**
 * Rockets Server settings interface
 */
export interface RocketsAuthSettingsInterface {
  role: {
    adminRoleName: string;
    defaultUserRoleName?: string;
  };
  email: {
    from: string;
    baseUrl: string;
    tokenUrlFormatter?: (baseUrl: string, passcode: string) => string;
    templates: {
      sendOtp: {
        fileName: string;
        subject: string;
      };
    };
  };
  /**
   * OTP settings
   */
  otp: RocketsAuthOtpSettingsInterface;
}
