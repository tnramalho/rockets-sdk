import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseProfileEntityInterface } from '@bitwild/rockets-server';

@Entity('profiles')
export class ProfileEntity implements BaseProfileEntityInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  userId!: string;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  dateUpdated!: Date;

  @Column({ type: 'datetime', nullable: true })
  dateDeleted!: Date | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  // 4 extra fields as requested
  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;
}
