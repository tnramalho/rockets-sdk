import { UserSqliteEntity } from '@concepta/nestjs-user';
import { UserProfileEntityFixture } from './user-profile.entity.fixture';
import { UserOtpEntityFixture } from './user-otp-entity.fixture';
export declare class UserFixture extends UserSqliteEntity {
    userProfile?: UserProfileEntityFixture;
    userOtps?: UserOtpEntityFixture[];
}
//# sourceMappingURL=user.entity.fixture.d.ts.map