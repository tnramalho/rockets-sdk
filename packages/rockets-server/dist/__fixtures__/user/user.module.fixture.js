"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModuleFixture = void 0;
const common_1 = require("@nestjs/common");
const user_model_service_fixture_1 = require("./user-model.service.fixture");
const user_controller_fixture_1 = require("./user.controller.fixture");
let UserModuleFixture = class UserModuleFixture {
};
UserModuleFixture = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [user_controller_fixture_1.UserControllerFixtures],
        providers: [user_model_service_fixture_1.UserModelServiceFixture],
        exports: [user_model_service_fixture_1.UserModelServiceFixture],
    })
], UserModuleFixture);
exports.UserModuleFixture = UserModuleFixture;
//# sourceMappingURL=user.module.fixture.js.map