import { Injectable } from '@nestjs/common';
import { CrudService } from '@concepta/nestjs-crud';
import { PetVaccinationEntity } from './pet-vaccination.entity';
import { PetVaccinationTypeOrmCrudAdapter } from './pet-vaccination-typeorm-crud.adapter';

/**
 * Pet Vaccination CRUD Service
 * 
 * Handles CRUD operations for pet vaccinations.
 * Used by CrudRelations to query vaccination relationships.
 */
@Injectable()
export class PetVaccinationCrudService extends CrudService<PetVaccinationEntity> {
  constructor(
    protected readonly crudAdapter: PetVaccinationTypeOrmCrudAdapter,
  ) {
    super(crudAdapter);
  }
}

