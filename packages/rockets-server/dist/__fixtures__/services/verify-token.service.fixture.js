"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTokenServiceFixture = void 0;
class VerifyTokenServiceFixture {
    constructor() {
        this.discriminator = 'default';
    }
    async accessToken(_token, _options) {
        return Promise.resolve({});
    }
    async refreshToken(_token, _options) {
        return Promise.resolve({});
    }
}
exports.VerifyTokenServiceFixture = VerifyTokenServiceFixture;
//# sourceMappingURL=verify-token.service.fixture.js.map