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
exports.RocketsServerNotificationService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_email_1 = require("@concepta/nestjs-email");
const rockets_server_constants_1 = require("../rockets-server.constants");
let RocketsServerNotificationService = class RocketsServerNotificationService {
    constructor(settings, emailService) {
        this.settings = settings;
        this.emailService = emailService;
    }
    async sendOtpEmail(params) {
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
};
RocketsServerNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rockets_server_constants_1.ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN)),
    __param(1, (0, common_1.Inject)(nestjs_email_1.EmailService)),
    __metadata("design:paramtypes", [Object, Object])
], RocketsServerNotificationService);
exports.RocketsServerNotificationService = RocketsServerNotificationService;
//# sourceMappingURL=rockets-server-notification.service.js.map