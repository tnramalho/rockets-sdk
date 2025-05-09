import { ReferenceActiveInterface, ReferenceEmailInterface, ReferenceIdInterface, UpdateOneInterface } from '@concepta/nestjs-common';
import { PasswordPlainInterface } from '@concepta/nestjs-common';
import { QueryOptionsInterface } from '@concepta/typeorm-common';
export interface RocketsUserMutateServiceInterface extends UpdateOneInterface<ReferenceIdInterface & PasswordPlainInterface & ReferenceActiveInterface, ReferenceIdInterface & ReferenceEmailInterface & ReferenceActiveInterface, QueryOptionsInterface> {
    update(object: ReferenceIdInterface & ReferenceActiveInterface, options?: QueryOptionsInterface): Promise<ReferenceIdInterface & ReferenceEmailInterface & ReferenceActiveInterface>;
    update(object: ReferenceIdInterface & PasswordPlainInterface, options?: QueryOptionsInterface): Promise<ReferenceIdInterface & ReferenceEmailInterface & ReferenceActiveInterface>;
}
//# sourceMappingURL=rockets-user-mutate-service.interface.d.ts.map