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
exports.AuthTokenRefreshController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const nestjs_auth_refresh_1 = require("@concepta/nestjs-auth-refresh");
const rockets_server_refresh_dto_1 = require("../../dto/auth/rockets-server-refresh.dto");
const rockets_server_jwt_response_dto_1 = require("../../dto/auth/rockets-server-jwt-response.dto");
let AuthTokenRefreshController = class AuthTokenRefreshController {
    constructor(issueTokenService) {
        this.issueTokenService = issueTokenService;
    }
    async refresh(user) {
        return this.issueTokenService.responsePayload(user.id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Generates a new access token using a valid refresh token',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_refresh_dto_1.RocketsServerRefreshDto,
        description: 'Refresh token information',
        examples: {
            standard: {
                value: {
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                summary: 'Standard refresh token request',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        type: rockets_server_jwt_response_dto_1.RocketsServerJwtResponseDto,
        description: 'New access and refresh tokens',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or expired refresh token',
    }),
    (0, common_1.Post)(),
    __param(0, (0, nestjs_authentication_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthTokenRefreshController.prototype, "refresh", null);
AuthTokenRefreshController = __decorate([
    (0, common_1.Controller)('token/refresh'),
    (0, common_1.UseGuards)(nestjs_auth_refresh_1.AuthRefreshGuard),
    (0, nestjs_authentication_1.AuthPublic)(),
    (0, swagger_1.ApiTags)('auth'),
    (0, swagger_1.ApiSecurity)('bearer'),
    __param(0, (0, common_1.Inject)(nestjs_auth_refresh_1.AuthRefreshIssueTokenService)),
    __metadata("design:paramtypes", [Object])
], AuthTokenRefreshController);
exports.AuthTokenRefreshController = AuthTokenRefreshController;
//# sourceMappingURL=auth-refresh.controller.js.map