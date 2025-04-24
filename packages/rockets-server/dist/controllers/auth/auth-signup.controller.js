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
exports.AuthSignupController = void 0;
const nestjs_authentication_1 = require("@concepta/nestjs-authentication");
const nestjs_user_1 = require("@concepta/nestjs-user");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rockets_server_user_create_dto_1 = require("../../dto/user/rockets-server-user-create.dto");
const rockets_server_user_dto_1 = require("../../dto/user/rockets-server-user.dto");
let AuthSignupController = class AuthSignupController {
    constructor(userModelService) {
        this.userModelService = userModelService;
    }
    async create(userCreateDto) {
        return this.userModelService.create(userCreateDto);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user account',
        description: 'Registers a new user in the system with email, username and password',
    }),
    (0, swagger_1.ApiBody)({
        type: rockets_server_user_create_dto_1.RocketsServerUserCreateDto,
        description: 'User registration information',
        examples: {
            standard: {
                value: {
                    email: 'user@example.com',
                    username: 'johndoe',
                    password: 'StrongP@ssw0rd',
                    active: true,
                },
                summary: 'Standard user registration',
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'User created successfully',
        type: rockets_server_user_dto_1.RocketsServerUserDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Bad request - Invalid input data or missing required fields',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Email or username already exists',
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rockets_server_user_create_dto_1.RocketsServerUserCreateDto]),
    __metadata("design:returntype", Promise)
], AuthSignupController.prototype, "create", null);
AuthSignupController = __decorate([
    (0, common_1.Controller)('signup'),
    (0, nestjs_authentication_1.AuthPublic)(),
    (0, swagger_1.ApiTags)('auth'),
    __param(0, (0, common_1.Inject)(nestjs_user_1.UserModelService)),
    __metadata("design:paramtypes", [nestjs_user_1.UserModelService])
], AuthSignupController);
exports.AuthSignupController = AuthSignupController;
//# sourceMappingURL=auth-signup.controller.js.map