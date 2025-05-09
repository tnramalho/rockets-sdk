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
exports.RocketsServerUserController = void 0;
const nestjs_user_1 = require("@concepta/nestjs-user");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rockets_server_user_update_dto_1 = require("../../dto/user/rockets-server-user-update.dto");
const rockets_server_user_dto_1 = require("../../dto/user/rockets-server-user.dto");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
let RocketsServerUserController = class RocketsServerUserController {
    constructor(userModelService) {
        this.userModelService = userModelService;
    }
    async findById(id) {
        return this.userModelService.byId(id);
    }
    async update(id, userUpdateDto) {
        return this.userModelService.update(Object.assign(Object.assign({}, userUpdateDto), { id }));
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user by ID',
        description: "Retrieves the currently authenticated user's profile information",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User profile retrieved successfully',
        type: rockets_server_user_dto_1.RocketsServerUserDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - User not authenticated',
    }),
    (0, common_1.Get)(''),
    __param(0, (0, nestjs_authentication_1.AuthUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RocketsServerUserController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a user',
        description: "Updates the currently authenticated user's profile information",
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_user_update_dto_1.RocketsServerUserUpdateDto,
        description: 'User profile information to update',
        examples: {
            user: {
                value: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                },
                summary: 'Standard user update',
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User updated successfully',
        type: rockets_server_user_dto_1.RocketsServerUserDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Bad request - Invalid input data',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - User not authenticated',
    }),
    (0, common_1.Patch)(''),
    __param(0, (0, nestjs_authentication_1.AuthUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rockets_server_user_update_dto_1.RocketsServerUserUpdateDto]),
    __metadata("design:returntype", Promise)
], RocketsServerUserController.prototype, "update", null);
RocketsServerUserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(nestjs_auth_jwt_1.AuthJwtGuard),
    (0, swagger_1.ApiTags)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)(nestjs_user_1.UserModelService)),
    __metadata("design:paramtypes", [nestjs_user_1.UserModelService])
], RocketsServerUserController);
exports.RocketsServerUserController = RocketsServerUserController;
//# sourceMappingURL=rockets-server-user.controller.js.map