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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsServerOtpCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RocketsServerOtpCreateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OTP category' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RocketsServerOtpCreateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OTP type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RocketsServerOtpCreateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignee' }),
    __metadata("design:type", Object)
], RocketsServerOtpCreateDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expiration time in seconds' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RocketsServerOtpCreateDto.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignment' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RocketsServerOtpCreateDto.prototype, "assignment", void 0);
exports.RocketsServerOtpCreateDto = RocketsServerOtpCreateDto;
//# sourceMappingURL=rockets-server-otp-create.dto.js.map