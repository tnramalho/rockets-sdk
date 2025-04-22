import { OtpCreatableInterface } from '@concepta/nestjs-common';
import { ReferenceAssignment } from '@concepta/nestjs-common';
export declare class RocketsServerOtpCreateDto implements OtpCreatableInterface {
    category: string;
    type: string;
    assignee: {
        id: string;
    };
    expiresIn: string;
    assignment: ReferenceAssignment;
}
//# sourceMappingURL=rockets-server-otp-create.dto.d.ts.map