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
  PetAppointmentCreateManyDto,
  PetAppointmentCreateDto,
  PetAppointmentPaginatedDto,
  PetAppointmentUpdateDto,
  PetAppointmentDto,
} from './pet-appointment.dto';
import { PetAppointmentAccessQueryService } from './pet-appointment-access-query.service';
import { PetAppointmentResource } from './pet-appointment.types';
import { PetAppointmentCrudService } from './pet-appointment.crud.service';
import { PetAppointmentEntity } from './pet-appointment.entity';
import {
  PetAppointmentEntityInterface,
  PetAppointmentCreatableInterface,
  PetAppointmentUpdatableInterface,
} from './pet-appointment.interface';

/**
 * Pet Appointment CRUD Controller
 * 
 * Provides REST API endpoints for managing pet appointment records.
 * All endpoints require authentication.
 * 
 * Endpoints:
 * - GET /pet-appointments - List all appointments (paginated)
 * - GET /pet-appointments/:id - Get appointment by ID
 * - POST /pet-appointments - Create single appointment
 * - POST /pet-appointments/bulk - Create multiple appointments
 * - PATCH /pet-appointments/:id - Update appointment
 * - DELETE /pet-appointments/:id - Delete appointment
 * - POST /pet-appointments/:id/recover - Recover soft-deleted appointment
 */
@CrudController({
  path: 'pet-appointments',
  model: {
    type: PetAppointmentDto,
    paginatedType: PetAppointmentPaginatedDto,
  },
})
@AccessControlQuery({
  service: PetAppointmentAccessQueryService,
})
@ApiTags('Pets')
@ApiBearerAuth()
export class PetAppointmentCrudController implements CrudControllerInterface<
  PetAppointmentEntityInterface,
  PetAppointmentCreatableInterface,
  PetAppointmentUpdatableInterface
> {
  constructor(private petAppointmentCrudService: PetAppointmentCrudService) {}

  @CrudReadMany()
  @AccessControlReadMany(PetAppointmentResource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>) {
    return this.petAppointmentCrudService.getMany(crudRequest);
  }

  @CrudReadOne()
  @AccessControlReadOne(PetAppointmentResource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>) {
    return this.petAppointmentCrudService.getOne(crudRequest);
  }

  @CrudCreateMany()
  @AccessControlCreateMany(PetAppointmentResource.Many)
  async createMany(
    @CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>,
    @CrudBody() petAppointmentCreateManyDto: PetAppointmentCreateManyDto,
  ) {
    return this.petAppointmentCrudService.createMany(crudRequest, petAppointmentCreateManyDto);
  }

  @CrudCreateOne({
    dto: PetAppointmentCreateDto,
  })
  @AccessControlCreateOne(PetAppointmentResource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>,
    @CrudBody() petAppointmentCreateDto: PetAppointmentCreateDto,
  ) {
    return this.petAppointmentCrudService.createOne(crudRequest, petAppointmentCreateDto);
  }

  @CrudUpdateOne({
    dto: PetAppointmentUpdateDto,
  })
  @AccessControlUpdateOne(PetAppointmentResource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>,
    @CrudBody() petAppointmentUpdateDto: PetAppointmentUpdateDto,
  ) {
    return this.petAppointmentCrudService.updateOne(crudRequest, petAppointmentUpdateDto);
  }

  @CrudDeleteOne()
  @AccessControlDeleteOne(PetAppointmentResource.One)
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>) {
    return this.petAppointmentCrudService.deleteOne(crudRequest);
  }

  @CrudRecoverOne()
  @AccessControlRecoverOne(PetAppointmentResource.One)
  async recoverOne(@CrudRequest() crudRequest: CrudRequestInterface<PetAppointmentEntity>) {
    return this.petAppointmentCrudService.recoverOne(crudRequest);
  }
}

