import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { PetVaccinationEntity } from './pet-vaccination.entity';

/**
 * Pet Vaccination TypeORM CRUD Adapter
 * 
 * Provides TypeORM repository access for Pet Vaccination CRUD operations.
 */
@Injectable()
export class PetVaccinationTypeOrmCrudAdapter extends TypeOrmCrudAdapter<PetVaccinationEntity> {
  constructor(
    @InjectRepository(PetVaccinationEntity)
    petVaccinationRepository: Repository<PetVaccinationEntity>,
  ) {
    super(petVaccinationRepository);
  }
}

