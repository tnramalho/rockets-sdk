/// <reference types="node" />
import { JwtSignOptions } from '@nestjs/jwt';
import { AuthenticationResponseInterface } from '@concepta/nestjs-common';
import { IssueTokenServiceInterface } from '@concepta/nestjs-authentication';
export declare class IssueTokenServiceFixture implements IssueTokenServiceInterface {
    discriminator: string;
    responsePayload(_id: string): Promise<AuthenticationResponseInterface>;
    accessToken(_payload: string | object | Buffer, _options?: JwtSignOptions | undefined): Promise<string>;
    refreshToken(_payload: string | object | Buffer, _options?: JwtSignOptions | undefined): Promise<string>;
}
//# sourceMappingURL=issue-token.service.fixture.d.ts.map