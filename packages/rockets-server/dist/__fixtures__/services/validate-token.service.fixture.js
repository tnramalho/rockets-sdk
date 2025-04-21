"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTokenServiceFixture = void 0;
class ValidateTokenServiceFixture {
    constructor() {
        this.discriminator = 'default';
    }
    async validateToken(_payload) {
        return Promise.resolve(true);
    }
}
exports.ValidateTokenServiceFixture = ValidateTokenServiceFixture;
//# sourceMappingURL=validate-token.service.fixture.js.map