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
exports.RocketsServerRecoveryController = void 0;
const nestjs_auth_recovery_1 = require("@concepta/nestjs-auth-recovery");
const nestjs_auth_verify_1 = require("@concepta/nestjs-auth-verify");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rockets_server_recover_login_dto_1 = require("../../dto/auth/rockets-server-recover-login.dto");
const rockets_server_recover_password_dto_1 = require("../../dto/auth/rockets-server-recover-password.dto");
const rockets_server_update_password_dto_1 = require("../../dto/auth/rockets-server-update-password.dto");
let RocketsServerRecoveryController = class RocketsServerRecoveryController {
    constructor(authRecoveryService) {
        this.authRecoveryService = authRecoveryService;
    }
    async recoverLogin(recoverLoginDto) {
        await this.authRecoveryService.recoverLogin(recoverLoginDto.email);
    }
    async recoverPassword(recoverPasswordDto) {
        await this.authRecoveryService.recoverPassword(recoverPasswordDto.email);
    }
    async validatePasscode(passcode) {
        const otp = await this.authRecoveryService.validatePasscode(passcode);
        if (!otp) {
            throw new nestjs_auth_verify_1.AuthRecoveryOtpInvalidException();
        }
    }
    async updatePassword(updatePasswordDto) {
        const { passcode, newPassword } = updatePasswordDto;
        const user = await this.authRecoveryService.updatePassword(passcode, newPassword);
        if (!user) {
            throw new nestjs_auth_verify_1.AuthRecoveryOtpInvalidException();
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Recover username',
        description: 'Sends an email with the username associated with the provided email address',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_recover_login_dto_1.RocketsServerRecoverLoginDto,
        description: 'Email address for username recovery',
        examples: {
            standard: {
                value: {
                    email: 'user@example.com',
                },
                summary: 'Standard username recovery request',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Recovery email sent successfully (returns regardless of whether email exists)',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid email format',
    }),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_recover_login_dto_1.RocketsServerRecoverLoginDto]),
    __metadata("design:returntype", Promise)
], RocketsServerRecoveryController.prototype, "recoverLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: 'Sends an email with a password reset link to the provided email address',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_recover_password_dto_1.RocketsServerRecoverPasswordDto,
        description: 'Email address for password reset',
        examples: {
            standard: {
                value: {
                    email: 'user@example.com',
                },
                summary: 'Standard password reset request',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Recovery email sent successfully (returns regardless of whether email exists)',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid email format',
    }),
    (0, common_1.Post)('/password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_recover_password_dto_1.RocketsServerRecoverPasswordDto]),
    __metadata("design:returntype", Promise)
], RocketsServerRecoveryController.prototype, "recoverPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Validate recovery passcode',
        description: 'Checks if the provided passcode is valid and not expired',
    }),
    (0, swagger_1.ApiParam)({
        name: 'passcode',
        description: 'Recovery passcode to validate',
        example: 'abc123def456',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Passcode is valid',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Passcode is invalid or expired',
    }),
    (0, common_1.Get)('/passcode/:passcode'),
    __param(0, (0, common_1.Param)('passcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RocketsServerRecoveryController.prototype, "validatePasscode", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password',
        description: 'Updates the user password using a valid recovery passcode',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_update_password_dto_1.RocketsServerUpdatePasswordDto,
        description: 'Passcode and new password information',
        examples: {
            standard: {
                value: {
                    passcode: 'abc123def456',
                    newPassword: 'NewSecureP@ssw0rd',
                },
                summary: 'Standard password reset',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Password updated successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid passcode, password requirements not met, or passcode expired',
    }),
    (0, common_1.Patch)('/password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_update_password_dto_1.RocketsServerUpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], RocketsServerRecoveryController.prototype, "updatePassword", null);
RocketsServerRecoveryController = __decorate([
    (0, common_1.Controller)('recovery'),
    (0, nestjs_authentication_1.AuthPublic)(),
    (0, swagger_1.ApiTags)('auth'),
    __param(0, (0, common_1.Inject)(nestjs_auth_recovery_1.AuthRecoveryService)),
    __metadata("design:paramtypes", [Object])
], RocketsServerRecoveryController);
exports.RocketsServerRecoveryController = RocketsServerRecoveryController;
//# sourceMappingURL=auth-recovery.controller.js.map