import { RocketsServerOtpSettingsInterface } from './rockets-server-otp-settings.interface';

/**
 * Rockets Server settings interface
 */
export interface RocketsServerSettingsInterface {
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
  otp: RocketsServerOtpSettingsInterface;
}
