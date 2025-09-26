import { Injectable } from '@nestjs/common';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { UserUserMetadataEntityFixture } from '../user/user-metadata.entity.fixture';

@Injectable()
export class UserUserMetadataTypeOrmCrudAdapterFixture extends TypeOrmCrudAdapter<UserUserMetadataEntityFixture> {
  // This is a fixture adapter for testing purposes
  // In a real application, this would be properly configured with a repository
}
