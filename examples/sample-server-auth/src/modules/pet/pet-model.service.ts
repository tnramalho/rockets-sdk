import { Injectable } from '@nestjs/common';
import {
  RepositoryInterface,
  ModelService,
  InjectDynamicRepository,
} from '@concepta/nestjs-common';
import { 
  PetEntityInterface, 
  PetCreatableInterface, 
  PetUpdatableInterface, 
  PetModelUpdatableInterface,
  PetModelServiceInterface,
  PetStatus,
} from './pet.interface';
import { PET_MODULE_PET_ENTITY_KEY } from './constants/pet.constants';
import { PetCreateDto, PetUpdateDto } from './pet.dto';

/**
 * Pet Model Service
 * 
 * Provides business logic for pet operations.
 * Extends the base ModelService and implements custom pet-specific methods.
 */
@Injectable()
export class PetModelService
  extends ModelService<
    PetEntityInterface,
    PetCreateDto,
    PetUpdateDto
  >
  implements PetModelServiceInterface
{
  public readonly createDto = PetCreateDto;
  public readonly updateDto = PetUpdateDto;

  constructor(
    @InjectDynamicRepository(PET_MODULE_PET_ENTITY_KEY)
    public readonly repo: RepositoryInterface<PetEntityInterface>,
  ) {
    super(repo);
  }

  /**
   * Override create method to add business validation
   */
  async create(data: PetCreatableInterface): Promise<PetEntityInterface> {
    // Set default status if not provided
    const petData = {
      status: PetStatus.ACTIVE,
      ...data,
    };
    return super.create(petData);
  }

  /**
   * Override update method to add business validation
   */
  async update(data: PetModelUpdatableInterface): Promise<PetEntityInterface> {
    // Ensure userId cannot be updated
    const { ...updateData } = data;
    return super.update(updateData);
  }

  /**
   * Get pet by ID with proper error handling
   */
  async getPetById(id: string): Promise<PetEntityInterface> {
    const pet = await this.repo.findOne({
      where: { 
        id, 
        dateDeleted: undefined
      }
    });
    
    if (!pet) {
      throw new Error(`Pet with ID ${id} not found`);
    }
    
    return pet;
  }

  /**
   * Find pets by user ID
   */
  async findByUserId(userId: string): Promise<PetEntityInterface[]> {
    return this.repo.find({
      where: { 
        userId, 
        dateDeleted: undefined
      }
    });
  }

  /**
   * Get pets by user ID with proper error handling
   */
  async getPetsByUserId(userId: string): Promise<PetEntityInterface[]> {
    return this.findByUserId(userId);
  }

  /**
   * Update pet data (excludes userId modification)
   */
  async updatePet(
    id: string,
    petData: PetUpdatableInterface,
  ): Promise<PetEntityInterface> {
    
    // Merge update data with existing pet (excluding userId)
    const updateData: PetModelUpdatableInterface = {
      id,
      ...petData,
    };
    
    return this.update(updateData);
  }

  /**
   * Soft delete a pet
   */
  async softDelete(id: string): Promise<PetEntityInterface> {
    const pet = await this.getPetById(id);
    
    // Perform soft delete by setting dateDeleted
    const updateData = {
      id,
      dateDeleted: new Date(),
      version: pet.version + 1,
    };
    
    return this.update(updateData as PetModelUpdatableInterface);
  }

  /**
   * Find pets by user ID and species
   */
  async findByUserIdAndSpecies(userId: string, species: string): Promise<PetEntityInterface[]> {
    return this.repo.find({
      where: { 
        userId, 
        species,
        dateDeleted: null as any
      }
    });
  }

  /**
   * Check if user owns the pet
   */
  async isPetOwnedByUser(petId: string, userId: string): Promise<boolean> {
    const pet = await this.repo.findOne({
      where: { 
        id: petId, 
        userId,
        dateDeleted: null as any
      }
    });
    return !!pet;
  }
}