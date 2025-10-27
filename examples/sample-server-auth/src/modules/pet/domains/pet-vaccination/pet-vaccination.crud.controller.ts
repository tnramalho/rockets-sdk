import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  AccessControlCreateMany,
  AccessControlCreateOne,
  AccessControlDeleteOne,
  AccessControlQuery,
  AccessControlReadMany,
  AccessControlReadOne,
  AccessControlRecoverOne,
  AccessControlUpdateOne,
} from '@concepta/nestjs-access-control';
import {
  CrudBody,
  CrudCreateOne,
  CrudDeleteOne,
  CrudReadOne,
  CrudRequest,
  CrudRequestInterface,
  CrudUpdateOne,
  CrudControllerInterface,
  CrudController,
  CrudCreateMany,
  CrudReadMany,
  CrudRecoverOne,
} from '@concepta/nestjs-crud';
import {
  PetVaccinationCreateManyDto,
  PetVaccinationCreateDto,
  PetVaccinationPaginatedDto,
  PetVaccinationUpdateDto,
  PetVaccinationDto,
} from './pet-vaccination.dto';
import { PetVaccinationAccessQueryService } from './pet-vaccination-access-query.service';
import { PetVaccinationResource } from './pet-vaccination.types';
import { PetVaccinationCrudService } from './pet-vaccination.crud.service';
import { PetVaccinationEntity } from './pet-vaccination.entity';
import {
  PetVaccinationEntityInterface,
  PetVaccinationCreatableInterface,
  PetVaccinationUpdatableInterface,
} from './pet-vaccination.interface';

/**
 * Pet Vaccination CRUD Controller
 * 
 * Provides REST API endpoints for managing pet vaccination records.
 * All endpoints require authentication.
 * 
 * Endpoints:
 * - GET /pet-vaccinations - List all vaccinations (paginated)
 * - GET /pet-vaccinations/:id - Get vaccination by ID
 * - POST /pet-vaccinations - Create single vaccination
 * - POST /pet-vaccinations/bulk - Create multiple vaccinations
 * - PATCH /pet-vaccinations/:id - Update vaccination
 * - DELETE /pet-vaccinations/:id - Delete vaccination
 * - POST /pet-vaccinations/:id/recover - Recover soft-deleted vaccination
 */
@CrudController({
  path: 'pet-vaccinations',
  model: {
    type: PetVaccinationDto,
    paginatedType: PetVaccinationPaginatedDto,
  },
})
@AccessControlQuery({
  service: PetVaccinationAccessQueryService,
})
@ApiTags('Pets')
@ApiBearerAuth()
export class PetVaccinationCrudController implements CrudControllerInterface<
  PetVaccinationEntityInterface,
  PetVaccinationCreatableInterface,
  PetVaccinationUpdatableInterface
> {
  constructor(private petVaccinationCrudService: PetVaccinationCrudService) {}

  @CrudReadMany()
  @AccessControlReadMany(PetVaccinationResource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>) {
    return this.petVaccinationCrudService.getMany(crudRequest);
  }

  @CrudReadOne()
  @AccessControlReadOne(PetVaccinationResource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>) {
    return this.petVaccinationCrudService.getOne(crudRequest);
  }

  @CrudCreateOne({
    dto: PetVaccinationCreateDto,
  })
  @AccessControlCreateOne(PetVaccinationResource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>,
    @CrudBody() petVaccinationCreateDto: PetVaccinationCreateDto,
  ) {
    return this.petVaccinationCrudService.createOne(crudRequest, petVaccinationCreateDto);
  }

  @CrudUpdateOne({
    dto: PetVaccinationUpdateDto,
  })
  @AccessControlUpdateOne(PetVaccinationResource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>,
    @CrudBody() petVaccinationUpdateDto: PetVaccinationUpdateDto,
  ) {
    return this.petVaccinationCrudService.updateOne(crudRequest, petVaccinationUpdateDto);
  }

  @CrudDeleteOne()
  @AccessControlDeleteOne(PetVaccinationResource.One)
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>) {
    return this.petVaccinationCrudService.deleteOne(crudRequest);
  }

  @CrudRecoverOne()
  @AccessControlRecoverOne(PetVaccinationResource.One)
  async recoverOne(@CrudRequest() crudRequest: CrudRequestInterface<PetVaccinationEntity>) {
    return this.petVaccinationCrudService.recoverOne(crudRequest);
  }
}

