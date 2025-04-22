import { OtpCreatableInterface, ReferenceAssignment } from '@concepta/nestjs-common';
export interface RocketsServerOtpSettingsInterface extends Pick<OtpCreatableInterface, 'category' | 'type' | 'expiresIn'>, Partial<Pick<OtpCreatableInterface, 'rateSeconds' | 'rateThreshold'>> {
    assignment: ReferenceAssignment;
    clearOtpOnCreate?: boolean;
}
//# sourceMappingURL=rockets-server-otp-settings.interface.d.ts.map