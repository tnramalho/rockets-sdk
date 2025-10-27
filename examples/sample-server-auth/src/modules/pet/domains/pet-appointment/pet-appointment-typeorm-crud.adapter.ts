import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { PetAppointmentEntity } from './pet-appointment.entity';

/**
 * Pet Appointment TypeORM CRUD Adapter
 * 
 * Provides TypeORM repository access for Pet Appointment CRUD operations.
 */
@Injectable()
export class PetAppointmentTypeOrmCrudAdapter extends TypeOrmCrudAdapter<PetAppointmentEntity> {
  constructor(
    @InjectRepository(PetAppointmentEntity)
    petAppointmentRepository: Repository<PetAppointmentEntity>,
  ) {
    super(petAppointmentRepository);
  }
}

