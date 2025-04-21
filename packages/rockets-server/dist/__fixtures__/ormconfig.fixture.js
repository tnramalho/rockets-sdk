"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormConfig = void 0;
const user_entity_fixture_1 = require("./user/user.entity.fixture");
const user_profile_entity_fixture_1 = require("./user/user-profile.entity.fixture");
const user_password_history_entity_fixture_1 = require("./user/user-password-history.entity.fixture");
const user_otp_entity_fixture_1 = require("./user/user-otp-entity.fixture");
exports.ormConfig = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [
        user_entity_fixture_1.UserFixture,
        user_profile_entity_fixture_1.UserProfileEntityFixture,
        user_password_history_entity_fixture_1.UserPasswordHistoryEntityFixture,
        user_otp_entity_fixture_1.UserOtpEntityFixture,
    ],
};
//# sourceMappingURL=ormconfig.fixture.js.map