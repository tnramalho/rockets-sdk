import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { RocketsServerOtpServiceInterface } from '../../interfaces/rockets-server-otp-service.interface';
export declare class OtpServiceFixture implements RocketsServerOtpServiceInterface {
    sendOtp(_email: string): Promise<void>;
    confirmOtp(_email: string, passcode: string): Promise<ReferenceIdInterface>;
}
//# sourceMappingURL=otp.service.fixture.d.ts.map