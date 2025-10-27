import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { PetEntity } from '../../entities/pet.entity';
import { PetModelService } from './pet-model.service';
import { PET_MODULE_PET_ENTITY_KEY } from './constants/pet.constants';

/**
 * Pet Module
 * 
 * Provides pet-related functionality including:
 * - Pet entity and repository configuration
 * - Pet model service for business logic
 * - TypeORM and TypeOrmExt integration
 */
@Module({
  imports: [
    // Register Pet entity with TypeORM
    TypeOrmModule.forFeature([PetEntity]),
    
    // Register Pet entity with TypeOrmExt for enhanced repository features
    TypeOrmExtModule.forFeature({
      [PET_MODULE_PET_ENTITY_KEY]: {
        entity: PetEntity,
      },
    }),
  ],
  providers: [
    // Pet business logic service
    PetModelService,
  ],
  exports: [
    // Export model service for use in controllers and other modules
    PetModelService,
    
    // Export TypeORM module for direct repository access if needed
    TypeOrmModule,
  ],
})
export class PetModule {}