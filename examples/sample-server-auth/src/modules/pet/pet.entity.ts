import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetInterface, PetStatus } from './pet.interface';

@Entity('pets')
export class PetEntity implements PetInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  species!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  breed?: string;

  @Column({ type: 'int', nullable: false })
  age!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  color?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: PetStatus.ACTIVE,
    nullable: false,
  })
  status!: PetStatus;

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
}