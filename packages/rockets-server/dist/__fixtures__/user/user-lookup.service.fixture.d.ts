import { ReferenceIdInterface, ReferenceSubject } from '@concepta/nestjs-common';
import { AuthJwtUserLookupServiceInterface } from '@concepta/nestjs-auth-jwt/dist/interfaces/auth-jwt-user-lookup-service.interface';
export declare class UserLookupServiceFixture implements AuthJwtUserLookupServiceInterface {
    bySubject(subject: ReferenceSubject): Promise<ReferenceIdInterface>;
}
//# sourceMappingURL=user-lookup.service.fixture.d.ts.map