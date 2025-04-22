export interface RocketsServerOtpNotificationServiceInterface {
    sendOtpEmail(params: {
        email: string;
        passcode: string;
    }): Promise<void>;
}
//# sourceMappingURL=rockets-server-otp-notification-service.interface.d.ts.map