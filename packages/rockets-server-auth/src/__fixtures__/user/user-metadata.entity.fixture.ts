import { Column, Entity, OneToOne } from 'typeorm';

import { UserFixture } from './user.entity.fixture';
import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';

/**
 * User UserMetadata Entity Fixture
 */
@Entity()
export class UserUserMetadataEntityFixture extends UserSqliteEntity {
  @OneToOne(() => UserFixture, (user) => user.userUserMetadata)
  user!: UserFixture;

  @Column({ nullable: true })
  firstName!: string;
}
