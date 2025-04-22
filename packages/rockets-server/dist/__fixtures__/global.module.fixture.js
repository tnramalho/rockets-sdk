"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModuleFixture = void 0;
const common_1 = require("@nestjs/common");
const issue_token_service_fixture_1 = require("./services/issue-token.service.fixture");
const verify_token_service_fixture_1 = require("./services/verify-token.service.fixture");
const validate_token_service_fixture_1 = require("./services/validate-token.service.fixture");
let GlobalModuleFixture = class GlobalModuleFixture {
};
GlobalModuleFixture = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            issue_token_service_fixture_1.IssueTokenServiceFixture,
            verify_token_service_fixture_1.VerifyTokenServiceFixture,
            validate_token_service_fixture_1.ValidateTokenServiceFixture,
        ],
        exports: [
            issue_token_service_fixture_1.IssueTokenServiceFixture,
            verify_token_service_fixture_1.VerifyTokenServiceFixture,
            validate_token_service_fixture_1.ValidateTokenServiceFixture,
        ],
    })
], GlobalModuleFixture);
exports.GlobalModuleFixture = GlobalModuleFixture;
//# sourceMappingURL=global.module.fixture.js.map