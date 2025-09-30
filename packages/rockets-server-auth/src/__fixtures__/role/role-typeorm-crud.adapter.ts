import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { RocketsAuthRoleEntityInterface } from '../../domains/role/interfaces/rockets-auth-role-entity.interface';
import { RoleEntityFixture } from './role.entity.fixture';

/**
 * Role TypeORM CRUD adapter
 */
@Injectable()
export class RoleTypeOrmCrudAdapter<
  T extends RocketsAuthRoleEntityInterface,
> extends TypeOrmCrudAdapter<T> {
  /**
   * Constructor
   *
   * @param roleRepo - instance of the role repository.
   */
  constructor(
    @InjectRepository(RoleEntityFixture)
    roleRepo: Repository<T>,
  ) {
    super(roleRepo);
  }
}
