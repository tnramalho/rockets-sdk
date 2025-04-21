"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServiceFixture = void 0;
const common_1 = require("@nestjs/common");
let OtpServiceFixture = class OtpServiceFixture {
    async sendOtp(_email) {
        return Promise.resolve();
    }
    async confirmOtp(_email, passcode) {
        if (passcode === 'GOOD_PASSCODE') {
            return { id: 'abc' };
        }
        throw new Error('Invalid OTP');
    }
};
OtpServiceFixture = __decorate([
    (0, common_1.Injectable)()
], OtpServiceFixture);
exports.OtpServiceFixture = OtpServiceFixture;
//# sourceMappingURL=otp.service.fixture.js.map