import { AuthLocalCredentialsInterface } from '@concepta/nestjs-auth-local';
import { LookupEmailInterface, LookupIdInterface, LookupSubjectInterface, LookupUsernameInterface, ReferenceEmail, ReferenceId, ReferenceIdInterface, ReferenceSubject, ReferenceUsername, ReferenceUsernameInterface } from '@concepta/nestjs-common';
import { QueryOptionsInterface } from '@concepta/typeorm-common';
export interface RocketsServerUserLookupServiceInterface extends LookupSubjectInterface<ReferenceSubject, ReferenceIdInterface, QueryOptionsInterface>, LookupUsernameInterface<ReferenceUsername, AuthLocalCredentialsInterface, QueryOptionsInterface>, LookupIdInterface<ReferenceId, ReferenceIdInterface, QueryOptionsInterface>, LookupEmailInterface<ReferenceEmail, ReferenceIdInterface & ReferenceUsernameInterface, QueryOptionsInterface> {
}
//# sourceMappingURL=rockets-server-user-lookup-service.interface.d.ts.map