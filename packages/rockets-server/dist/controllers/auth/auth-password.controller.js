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
exports.AuthPasswordController = void 0;
const nestjs_auth_local_1 = require("@concepta/nestjs-auth-local");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rockets_server_jwt_response_dto_1 = require("../../dto/auth/rockets-server-jwt-response.dto");
const rockets_server_login_dto_1 = require("../../dto/auth/rockets-server-login.dto");
let AuthPasswordController = class AuthPasswordController {
    constructor(issueTokenService) {
        this.issueTokenService = issueTokenService;
    }
    async login(user) {
        return this.issueTokenService.responsePayload(user.id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Authenticate with username/email and password',
        description: 'Validates credentials and returns authentication tokens on success',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_login_dto_1.RocketsServerLoginDto,
        description: 'User credentials',
        examples: {
            standard: {
                value: {
                    username: 'user@example.com',
                    password: 'YourPassword123!',
                },
                summary: 'Standard login request',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        type: rockets_server_jwt_response_dto_1.RocketsServerJwtResponseDto,
        description: 'Authentication successful, tokens provided',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid credentials or inactive account',
    }),
    (0, common_1.Post)(),
    __param(0, (0, nestjs_authentication_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthPasswordController.prototype, "login", null);
AuthPasswordController = __decorate([
    (0, common_1.Controller)('token/password'),
    (0, common_1.UseGuards)(nestjs_auth_local_1.AuthLocalGuard),
    (0, nestjs_authentication_1.AuthPublic)(),
    (0, swagger_1.ApiTags)('auth'),
    __param(0, (0, common_1.Inject)(nestjs_auth_local_1.AuthLocalIssueTokenService)),
    __metadata("design:paramtypes", [Object])
], AuthPasswordController);
exports.AuthPasswordController = AuthPasswordController;
//# sourceMappingURL=auth-password.controller.js.map