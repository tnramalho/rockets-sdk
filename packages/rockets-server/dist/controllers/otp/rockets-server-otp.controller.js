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
exports.RocketsServerOtpController = void 0;
const nestjs_auth_local_1 = require("@concepta/nestjs-auth-local");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rockets_server_jwt_response_dto_1 = require("../../dto/auth/rockets-server-jwt-response.dto");
const rockets_server_otp_confirm_dto_1 = require("../../dto/rockets-server-otp-confirm.dto");
const rockets_server_otp_send_dto_1 = require("../../dto/rockets-server-otp-send.dto");
const rockets_server_otp_service_1 = require("../../services/rockets-server-otp.service");
let RocketsServerOtpController = class RocketsServerOtpController {
    constructor(issueTokenService, otpService) {
        this.issueTokenService = issueTokenService;
        this.otpService = otpService;
    }
    async sendOtp(dto) {
        return this.otpService.sendOtp(dto.email);
    }
    async confirmOtp(dto) {
        const user = await this.otpService.confirmOtp(dto.email, dto.passcode);
        return this.issueTokenService.responsePayload(user.id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Send OTP to the provided email',
        description: 'Generates a one-time passcode and sends it to the specified email address',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_otp_send_dto_1.RocketsServerOtpSendDto,
        description: 'Email to receive the OTP',
        examples: {
            standard: {
                value: {
                    email: 'user@example.com',
                },
                summary: 'Standard OTP request',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OTP sent successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid email format',
    }),
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_otp_send_dto_1.RocketsServerOtpSendDto]),
    __metadata("design:returntype", Promise)
], RocketsServerOtpController.prototype, "sendOtp", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm OTP for a given email and passcode',
        description: 'Validates the OTP passcode for the specified email and returns authentication tokens on success',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_otp_confirm_dto_1.RocketsServerOtpConfirmDto,
        description: 'Email and passcode for OTP verification',
        examples: {
            standard: {
                value: {
                    email: 'user@example.com',
                    passcode: '123456',
                },
                summary: 'Standard OTP confirmation',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'OTP confirmed successfully, authentication tokens provided',
        type: rockets_server_jwt_response_dto_1.RocketsServerJwtResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid email format or missing required fields',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid OTP or expired passcode',
    }),
    (0, common_1.Patch)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_otp_confirm_dto_1.RocketsServerOtpConfirmDto]),
    __metadata("design:returntype", Promise)
], RocketsServerOtpController.prototype, "confirmOtp", null);
RocketsServerOtpController = __decorate([
    (0, common_1.Controller)('otp'),
    (0, nestjs_authentication_1.AuthPublic)(),
    (0, swagger_1.ApiTags)('otp'),
    __param(0, (0, common_1.Inject)(nestjs_auth_local_1.AuthLocalIssueTokenService)),
    __metadata("design:paramtypes", [Object, rockets_server_otp_service_1.RocketsServerOtpService])
], RocketsServerOtpController);
exports.RocketsServerOtpController = RocketsServerOtpController;
//# sourceMappingURL=rockets-server-otp.controller.js.map