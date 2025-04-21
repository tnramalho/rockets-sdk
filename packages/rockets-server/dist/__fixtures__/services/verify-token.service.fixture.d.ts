import { VerifyTokenServiceInterface } from '@concepta/nestjs-authentication';
import { JwtVerifyOptions } from '@nestjs/jwt';
export declare class VerifyTokenServiceFixture implements VerifyTokenServiceInterface {
    discriminator: string;
    accessToken(_token: string, _options?: JwtVerifyOptions | undefined): Promise<object>;
    refreshToken(_token: string, _options?: JwtVerifyOptions | undefined): Promise<object>;
}
//# sourceMappingURL=verify-token.service.fixture.d.ts.map