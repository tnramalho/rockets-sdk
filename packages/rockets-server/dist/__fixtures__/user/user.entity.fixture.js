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
exports.UserFixture = void 0;
const nestjs_user_1 = require("@concepta/nestjs-user");
const typeorm_1 = require("typeorm");
const user_profile_entity_fixture_1 = require("./user-profile.entity.fixture");
const user_otp_entity_fixture_1 = require("./user-otp-entity.fixture");
let UserFixture = class UserFixture extends nestjs_user_1.UserSqliteEntity {
};
__decorate([
    (0, typeorm_1.OneToOne)(() => user_profile_entity_fixture_1.UserProfileEntityFixture, (userProfile) => userProfile.user),
    __metadata("design:type", user_profile_entity_fixture_1.UserProfileEntityFixture)
], UserFixture.prototype, "userProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_otp_entity_fixture_1.UserOtpEntityFixture, (userOtp) => userOtp.assignee),
    __metadata("design:type", Array)
], UserFixture.prototype, "userOtps", void 0);
UserFixture = __decorate([
    (0, typeorm_1.Entity)()
], UserFixture);
exports.UserFixture = UserFixture;
//# sourceMappingURL=user.entity.fixture.js.map