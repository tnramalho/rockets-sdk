import { ReferenceIdInterface } from '@concepta/nestjs-common';

export interface RocketsAuthOtpServiceInterface {
  sendOtp(email: string): Promise<void>;

  confirmOtp(email: string, passcode: string): Promise<ReferenceIdInterface>;
}
