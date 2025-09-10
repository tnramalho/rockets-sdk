import { Entity } from 'typeorm';
import { RoleSqliteEntity } from '@concepta/nestjs-typeorm-ext';

@Entity('role')
export class RoleEntityFixture extends RoleSqliteEntity {
  // Base entity has all the necessary properties
}