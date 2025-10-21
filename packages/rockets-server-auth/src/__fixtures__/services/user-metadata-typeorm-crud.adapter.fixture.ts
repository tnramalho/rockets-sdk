import { Injectable } from '@nestjs/common';
import { CrudAdapter, TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMetadataEntityFixture } from '../user/user-metadata.entity.fixture';
import { RocketsAuthUserMetadataEntityInterface } from '../../domains/user/interfaces/rockets-auth-user-metadata-entity.interface';

@Injectable()
export class UserMetadataTypeOrmCrudAdapterFixture
  extends TypeOrmCrudAdapter<RocketsAuthUserMetadataEntityInterface>
  implements CrudAdapter<RocketsAuthUserMetadataEntityInterface>
{
  constructor(
    @InjectRepository(UserMetadataEntityFixture)
    repo: Repository<RocketsAuthUserMetadataEntityInterface>,
  ) {
    super(repo);
  }
}
