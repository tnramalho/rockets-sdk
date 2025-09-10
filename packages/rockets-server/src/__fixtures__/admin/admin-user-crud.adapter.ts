import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';

import { UserEntityFixture } from '../user/user.entity.fixture';
import { RocketsServerAuthUserEntityInterface } from '@bitwild/rockets-server-auth';

/**
 * Single reusable TypeORM CRUD adapter for admin user operations
 *
 * This adapter can be used for both listing users and individual user CRUD operations
 * It provides a unified interface for all admin user-related database operations
 */
export class AdminUserTypeOrmCrudAdapter extends TypeOrmCrudAdapter<RocketsServerAuthUserEntityInterface> {
  constructor(
    @InjectRepository(UserEntityFixture)
    private readonly repository: Repository<RocketsServerAuthUserEntityInterface>,
  ) {
    super(repository);
  }
}
