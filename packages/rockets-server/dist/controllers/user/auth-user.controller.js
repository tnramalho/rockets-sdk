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
exports.AuthUserController = void 0;
const nestjs_user_1 = require("@concepta/nestjs-user");
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_user_2 = require("@concepta/nestjs-user");
const nestjs_auth_jwt_1 = require("@concepta/nestjs-auth-jwt");
let AuthUserController = class AuthUserController {
    constructor(userMutateService, userLookupService) {
        this.userMutateService = userMutateService;
        this.userLookupService = userLookupService;
    }
    async findById(id) {
        return this.userLookupService.byId(id);
    }
    async update(id, userUpdateDto) {
        return this.userMutateService.update(Object.assign({ id }, userUpdateDto));
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user by ID',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, common_1.Get)(''),
    __param(0, (0, nestjs_authentication_1.AuthUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthUserController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a user',
    }),
    (0, swagger_1.ApiBody)({
        type: nestjs_user_2.UserUpdateDto,
        description: 'DTO for updating a user',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, common_1.Patch)(''),
    __param(0, (0, nestjs_authentication_1.AuthUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_user_2.UserUpdateDto]),
    __metadata("design:returntype", Promise)
], AuthUserController.prototype, "update", null);
AuthUserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(nestjs_auth_jwt_1.AuthJwtGuard),
    (0, swagger_1.ApiTags)('user'),
    __param(0, (0, common_1.Inject)(nestjs_user_1.UserMutateService)),
    __param(1, (0, common_1.Inject)(nestjs_user_1.UserLookupService)),
    __metadata("design:paramtypes", [nestjs_user_1.UserMutateService,
        nestjs_user_1.UserLookupService])
], AuthUserController);
exports.AuthUserController = AuthUserController;
//# sourceMappingURL=auth-user.controller.js.map