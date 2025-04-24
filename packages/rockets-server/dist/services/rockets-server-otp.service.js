"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsServerOtpService = void 0;
const nestjs_otp_1 = require("@concepta/nestjs-otp");
const common_1 = require("@nestjs/common");
const rockets_server_constants_1 = require("../rockets-server.constants");
const rockets_server_notification_service_1 = require("./rockets-server-notification.service");
let RocketsServerOtpService = class RocketsServerOtpService {
    constructor(settings, userModelService, otpService, otpNotificationService) {
        this.settings = settings;
        this.userModelService = userModelService;
        this.otpService = otpService;
        this.otpNotificationService = otpNotificationService;
    }
    async sendOtp(email) {
        const user = await this.userModelService.byEmail(email);
        const { assignment, category, expiresIn } = this.settings.otp;
        if (user) {
            const otp = await this.otpService.create({
                assignment,
                otp: {
                    category,
                    type: 'uuid',
                    assigneeId: user.id,
                    expiresIn: expiresIn,
                },
            });
            await this.otpNotificationService.sendOtpEmail({
                email,
                passcode: otp.passcode,
            });
        }
    }
    async confirmOtp(email, passcode) {
        const { assignment, category } = this.settings.otp;
        const user = await this.userModelService.byEmail(email);
        if (!user) {
            throw new nestjs_otp_1.OtpException();
        }
        const isValid = await this.otpService.validate(assignment, {
            category: category,
            passcode,
        }, true);
        if (!isValid) {
            throw new nestjs_otp_1.OtpException();
        }
        return user;
    }
};
RocketsServerOtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rockets_server_constants_1.ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN)),
    __param(1, (0, common_1.Inject)(rockets_server_constants_1.RocketsServerUserLookupService)),
    __param(3, (0, common_1.Inject)(rockets_server_notification_service_1.RocketsServerNotificationService)),
    __metadata("design:paramtypes", [Object, Object, nestjs_otp_1.OtpService, Object])
], RocketsServerOtpService);
exports.RocketsServerOtpService = RocketsServerOtpService;
//# sourceMappingURL=rockets-server-otp.service.js.map