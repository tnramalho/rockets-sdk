import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { FederatedSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntityFixture } from '../user/user.entity.fixture';

@Entity('federated')
export class FederatedEntityFixture extends FederatedSqliteEntity {
  @ManyToOne(() => UserEntityFixture, (user) => user.federatedAccounts)
  assignee!: ReferenceIdInterface;
}