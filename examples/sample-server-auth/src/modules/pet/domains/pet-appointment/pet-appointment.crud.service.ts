import { Injectable } from '@nestjs/common';
import { CrudService } from '@concepta/nestjs-crud';
import { PetAppointmentEntity } from './pet-appointment.entity';
import { PetAppointmentTypeOrmCrudAdapter } from './pet-appointment-typeorm-crud.adapter';

/**
 * Pet Appointment CRUD Service
 * 
 * Handles CRUD operations for pet appointments.
 * Used by CrudRelations to query appointment relationships.
 */
@Injectable()
export class PetAppointmentCrudService extends CrudService<PetAppointmentEntity> {
  constructor(
    protected readonly crudAdapter: PetAppointmentTypeOrmCrudAdapter,
  ) {
    super(crudAdapter);
  }
}

