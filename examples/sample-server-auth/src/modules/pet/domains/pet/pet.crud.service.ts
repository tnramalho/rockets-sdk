import { Inject, Injectable } from '@nestjs/common';
import { CrudService, CrudRelationRegistry } from '@concepta/nestjs-crud';
import { CrudRequestInterface } from '@concepta/nestjs-crud';
import { PetEntityInterface, PetStatus } from './pet.interface';
import { PetTypeOrmCrudAdapter } from './pet-typeorm-crud.adapter';
import { PetModelService } from './pet-model.service';
import { PetCreateDto, PetUpdateDto, PetCreateManyDto } from './pet.dto';
import { 
  PetException, 
  PetNameAlreadyExistsException 
} from './pet.exception';
import { PetEntity } from './pet.entity';
import { PetVaccinationEntity } from '../pet-vaccination';
import { PetAppointmentEntity } from '../pet-appointment';

@Injectable()
export class PetCrudService extends CrudService<PetEntity, [PetVaccinationEntity, PetAppointmentEntity]> {
  constructor(
    @Inject(PetTypeOrmCrudAdapter)
    protected readonly crudAdapter: PetTypeOrmCrudAdapter,
    private readonly petModelService: PetModelService,
    @Inject('PET_RELATION_REGISTRY')
    protected readonly relationRegistry: CrudRelationRegistry<PetEntity, [PetVaccinationEntity, PetAppointmentEntity]>,
  ) {
    super(crudAdapter, relationRegistry);
  }

  async createOne(
    req: CrudRequestInterface<PetEntity>,
    dto: PetCreateDto,
    options?: Record<string, unknown>,
  ): Promise<PetEntity> {
    try {
      return await super.createOne(req, dto, options);
    } catch (error) {
      if (error instanceof PetException) {
        throw error;
      }
      throw new PetException('Failed to create pet', { originalError: error });
    }
  }

  async updateOne(
    req: CrudRequestInterface<PetEntity>,
    dto: PetUpdateDto,
    options?: Record<string, unknown>,
  ): Promise<PetEntity> {
    try {
      return await super.updateOne(req, dto, options);
    } catch (error) {
      if (error instanceof PetException) {
        throw error;
      }
      console.error('Unexpected error in pet updateOne:', error);
      throw new PetException('Failed to update pet', { originalError: error });
    }
  }

  async deleteOne(
    req: CrudRequestInterface<PetEntity>,
    options?: Record<string, unknown>,
  ): Promise<void | PetEntity> {
    try {
      return await super.deleteOne(req, options);
    } catch (error) {
      if (error instanceof PetException) {
        throw error;
      }
      throw new PetException('Failed to delete pet', { originalError: error });
    }
  }
}

