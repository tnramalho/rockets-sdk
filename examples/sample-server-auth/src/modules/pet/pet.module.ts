import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { CrudRelationRegistry } from '@concepta/nestjs-crud';

// Pet Domain
import {
  PetEntity,
  PetModelService,
  PetTypeOrmCrudAdapter,
  PetCrudService,
  PetAccessQueryService,
  PetCrudController,
} from './domains/pet';

// Pet Vaccination Domain
import {
  PetVaccinationEntity,
  PetVaccinationTypeOrmCrudAdapter,
  PetVaccinationCrudService,
  PetVaccinationCrudController,
  PetVaccinationAccessQueryService,
} from './domains/pet-vaccination';

// Pet Appointment Domain
import {
  PetAppointmentEntity,
  PetAppointmentTypeOrmCrudAdapter,
  PetAppointmentCrudService,
  PetAppointmentCrudController,
  PetAppointmentAccessQueryService,
} from './domains/pet-appointment';

// Constants
import { PET_MODULE_PET_ENTITY_KEY } from './constants/pet.constants';

/**
 * Pet Module
 * 
 * Provides pet-related functionality including:
 * - Pet entity and repository configuration
 * - Pet vaccination and appointment tracking
 * - Pet model service for business logic
 * - CRUD operations with access control
 * - Relationship queries for vaccinations and appointments
 * - Separate CRUD controllers for pets, vaccinations, and appointments
 * - TypeORM and TypeOrmExt integration
 */
@Module({
  imports: [
    // Register Pet entities with TypeORM including related entities
    TypeOrmModule.forFeature([
      PetEntity,
      PetVaccinationEntity,
      PetAppointmentEntity,
    ]),
    
    // Register Pet entity with TypeOrmExt for enhanced repository features
    TypeOrmExtModule.forFeature({
      [PET_MODULE_PET_ENTITY_KEY]: {
        entity: PetEntity,
      },
    }),
  ],
  controllers: [
    PetCrudController,
    PetVaccinationCrudController,
    PetAppointmentCrudController,
  ],
  providers: [
    // Database adapters
    PetTypeOrmCrudAdapter,
    PetVaccinationTypeOrmCrudAdapter,
    PetAppointmentTypeOrmCrudAdapter,
    
    // Business logic service
    PetModelService,
    
    // CRUD operations services
    PetCrudService,
    PetVaccinationCrudService,
    PetAppointmentCrudService,
    
    // Access control services
    PetAccessQueryService,
    PetVaccinationAccessQueryService,
    PetAppointmentAccessQueryService,
    
    // Relation registry for CrudRelations
    {
      provide: 'PET_RELATION_REGISTRY',
      inject: [PetVaccinationCrudService, PetAppointmentCrudService],
      useFactory(
        vaccinationService: PetVaccinationCrudService,
        appointmentService: PetAppointmentCrudService,
      ) {
        const registry = new CrudRelationRegistry<
          PetEntity,
          [PetVaccinationEntity, PetAppointmentEntity]
        >();
        registry.register(vaccinationService);
        registry.register(appointmentService);
        return registry;
      },
    },
  ],
  exports: [
    // Export model service for use in other modules
    PetModelService,
    
    // Export CRUD adapters for advanced use cases
    PetTypeOrmCrudAdapter,
    PetVaccinationTypeOrmCrudAdapter,
    PetAppointmentTypeOrmCrudAdapter,
    
    // Export TypeORM module for relationship entities
    TypeOrmModule,
  ],
})
export class PetModule {}
