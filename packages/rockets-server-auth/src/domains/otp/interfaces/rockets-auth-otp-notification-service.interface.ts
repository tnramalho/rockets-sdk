export interface RocketsAuthOtpNotificationServiceInterface {
  sendOtpEmail(params: { email: string; passcode: string }): Promise<void>;
}
