# AI Templates Guide

> **For AI Tools**: This guide provides copy-paste templates and workflows optimized for AI-assisted development. Use this when working with Claude, Cursor, GitHub Copilot, or other AI coding tools.

## 📋 **Quick Reference**

| Task | Section |
|------|---------|
| Generate complete entity module | [Full Module Template](#full-module-template) |
| Copy-paste individual files | [Individual File Templates](#individual-file-templates) |
| File creation order | [Development Workflow](#development-workflow) |
| Success criteria checklist | [Quality Checklist](#quality-checklist) |

---


## File Naming Conventions

### Directory Structure

```
src/
├── modules/
│   └── {entity}/                    # kebab-case, singular
│       ├── {entity}.entity.ts       # entity definition
│       ├── {entity}.interface.ts    # all interfaces + enums
│       ├── {entity}.dto.ts          # API DTOs
│       ├── {entity}.exception.ts    # business exceptions
│       ├── {entity}.constants.ts    # module constants
│       ├── {entity}-model.service.ts # business logic
│       ├── {entity}-typeorm-crud.adapter.ts # database adapter
│       ├── {entity}-crud.service.ts # CRUD operations
│       ├── {entity}-crud.controller.ts # API endpoints
│       ├── {entity}-access-query.service.ts # access control
│       ├── {entity}.module.ts       # module configuration
│       └── index.ts                 # exports
├── common/
│   ├── filters/                     # exception filters
│   ├── guards/                      # custom guards
│   ├── decorators/                  # custom decorators
│   └── interceptors/                # custom interceptors
├── config/
│   ├── database.config.ts           # database configuration
│   └── app.config.ts               # application configuration
└── main.ts                         # application bootstrap
```

### File Naming Patterns

| File Type | Pattern | Example |
|-----------|---------|---------|
| Entity | `{entity}.entity.ts` | `product.entity.ts` |
| Interface | `{entity}.interface.ts` | `product.interface.ts` |
| DTO | `{entity}.dto.ts` | `product.dto.ts` |
| Exception | `{entity}.exception.ts` | `product.exception.ts` |
| Constants | `{entity}.constants.ts` | `product.constants.ts` |
| Model Service | `{entity}-model.service.ts` | `product-model.service.ts` |
| CRUD Service | `{entity}.crud.service.ts` | `product.crud.service.ts` |
| Controller | `{entity}.crud.controller.ts` | `product.crud.controller.ts` |
| Adapter | `{entity}-typeorm-crud.adapter.ts` | `product-typeorm-crud.adapter.ts` |
| Access Control | `{entity}-access-query.service.ts` | `product-access-query.service.ts` |
| Module | `{entity}.module.ts` | `product.module.ts` |

## AI Development Workflow

### **Phase 1: Planning (1 prompt)**
```
Create a complete {Entity} module using the Rockets Server SDK patterns.

Business Requirements:
- Review TECHNICAL_SPECIFICATION.md for {Entity} business rules
- Extract validation requirements from specification
- Identify relationships to other entities from specification
- Follow data model and business logic defined in specification

User Roles & Permissions:
- Reference TECHNICAL_SPECIFICATION.md for role-based access requirements
- Default to Admin: Full CRUD access if not specified
- Implement additional role restrictions as defined in specification

Use these existing modules as reference patterns:
- Follow established module patterns in the codebase
- Use ERROR_HANDLING_GUIDE.md for exception patterns
- Use ACCESS_CONTROL_GUIDE.md for permission patterns
- Maintain consistency with existing entity modules
```

### **Phase 2: File Generation Order**

**Prompt the AI to create files in this exact order:**

1. **Interface & Constants** (Foundation)
2. **Entity** (Database Layer)
3. **DTOs** (API Contracts)  
4. **Exceptions** (Error Handling)
5. **Model Service** (Business Logic)
6. **Adapter** (Database Layer)
7. **CRUD Service** (Business Operations)
8. **Access Control** (Security)
9. **Controller** (API Endpoints)
10. **Module** (Dependency Injection)

---

## Full Module Template

### AI Prompt Template

```
Create a complete {Entity} module with the following files using Rockets Server SDK patterns:

BUSINESS CONTEXT:
- Entity: {Entity}
- Purpose: {Refer to TECHNICAL_SPECIFICATION.md for entity purpose}
- Relationships: {Extract from TECHNICAL_SPECIFICATION.md}
- Business Rules: {Extract validation rules from TECHNICAL_SPECIFICATION.md}
- Role Access: {Extract from TECHNICAL_SPECIFICATION.md or default to Admin: full access}

TECHNICAL REQUIREMENTS:
- Use established patterns from existing modules in codebase
- Implement EntityException base class pattern
- Model service extends ModelService base class
- Simple adapter methods calling super with basic error handling
- Include access control with CanAccess interface (basic implementation)
- Follow DTO patterns with PickType/IntersectionType
- Use proper error handling flow (instanceof checks)

FILES TO CREATE:
1. {entity}.interface.ts - Business interfaces and enums
2. {entity}.constants.ts - Module constants and entity keys
3. {entity}.entity.ts - TypeORM entity extending CommonPostgresEntity
4. {entity}.dto.ts - API DTOs with validation
5. {entity}.exception.ts - Exception hierarchy
6. {entity}-model.service.ts - Business logic service
7. {entity}-typeorm-crud.adapter.ts - Database adapter
8. {entity}.crud.service.ts - CRUD operations
9. {entity}-access-query.service.ts - Access control
10. {entity}.crud.controller.ts - API endpoints
11. {entity}.module.ts - Module configuration
12. {entity}.index.ts - Exports for module

PATTERNS TO FOLLOW:
- Error handling: instanceof EntityException vs InternalServerErrorException
- Constructor pattern: @Inject(Adapter) + super(adapter) 
- DTO composition: PickType, PartialType for Create/Update DTOs
- Access control: CanAccess interface with role-based logic
- Validation: class-validator decorators with custom messages
- Constants: Import from {entity}.constants.ts file

Create each file with complete implementation following the established patterns.
```

---

## Individual File Templates

### 1. Interface Template

```typescript
// {entity}.interface.ts
import {
  AuditInterface,
  ByIdInterface,
  CreateOneInterface,
  FindInterface,
  ReferenceId,
  ReferenceIdInterface,
  RemoveOneInterface,
  UpdateOneInterface
} from '@concepta/nestjs-common';

/**
 * {Entity} Status Enumeration
 * Defines possible status values for {entity}s
 */
export enum {Entity}Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * {Entity} DTO Interface
 * Defines the shape of {entity} data in API responses
 */
export interface {Entity}Interface extends ReferenceIdInterface, AuditInterface {
  name: string;
  status: {Entity}Status;
  // Add other entity-specific fields
}

/**
 * {Entity} Entity Interface
 * Defines the structure of the {Entity} entity in the database
 */
export interface {Entity}EntityInterface extends {Entity}Interface { }

/**
 * {Entity} Creatable Interface
 * Defines what fields can be provided when creating a {entity}
 */
export interface {Entity}CreatableInterface extends Pick<{Entity}Interface, 'name'>, Partial<Pick<{Entity}Interface, 'status'>> {}

/**
 * {Entity} Updatable Interface
 * Defines what fields can be updated on a {entity}
 */
export interface {Entity}UpdatableInterface extends Pick<{Entity}Interface, 'id'>, Partial<Pick<{Entity}Interface, 'name' | 'status'>> {}

/**
 * {Entity} Model Updatable Interface  
 * Defines what fields can be updated via model service
 */
export interface {Entity}ModelUpdatableInterface extends Partial<Pick<{Entity}Interface, 'name' | 'status'>> {
  id?: string;
}

/**
 * {Entity} Model Service Interface
 * Defines the contract for the {Entity} model service
 */
export interface {Entity}ModelServiceInterface
  extends FindInterface<{Entity}EntityInterface, {Entity}EntityInterface>,
  ByIdInterface<string, {Entity}EntityInterface>,
    CreateOneInterface<{Entity}CreatableInterface, {Entity}EntityInterface>,
    UpdateOneInterface<{Entity}ModelUpdatableInterface, {Entity}EntityInterface>,
    RemoveOneInterface<Pick<{Entity}EntityInterface, 'id'>, {Entity}EntityInterface>
{
  
}
```

### 2. Constants Template

```typescript
// {entity}.constants.ts

/**
 * {Entity} Module Constants
 * Contains all constants used throughout the {entity} module
 */

/**
 * Entity key for TypeORM dynamic repository injection
 */
export const {ENTITY}_MODULE_{ENTITY}_ENTITY_KEY = '{entity}';

/**
 * {Entity} Resource Definitions
 * Used for access control and API resource identification
 */
export const {Entity}Resource = {
  One: '{entity}-one',
  Many: '{entity}-many',
} as const;

export type {Entity}ResourceType = typeof {Entity}Resource[keyof typeof {Entity}Resource];
```

### 3. Entity Template

```typescript
// {entity}.entity.ts
import { Entity, Column } from 'typeorm';
import { CommonPostgresEntity } from '@concepta/nestjs-typeorm-ext';
import { {Entity}EntityInterface, {Entity}Status } from './{entity}.interface';

/**
 * {Entity} Entity
 * 
 * Represents a {entity} in the system.
 */
@Entity('{entity}')
export class {Entity}Entity extends CommonPostgresEntity implements {Entity}EntityInterface {
  /**
   * {Entity} name (required)
   */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * {Entity} status (required)
   */
  @Column({
    type: 'enum',
    enum: {Entity}Status,
    default: {Entity}Status.ACTIVE,
  })
  status!: {Entity}Status;

  // Add other entity-specific fields here
  // @Column({ type: 'text', nullable: true })
  // description?: string;
  
  // Add relationships here when needed
  // @OneToMany(() => RelatedEntity, (related) => related.{entity})
  // relatedEntities?: RelatedEntity[];
}
```

### 4. DTO Template

```typescript
// {entity}.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger';
import { CommonEntityDto } from '@concepta/nestjs-common';
import { CrudResponsePaginatedDto } from '@concepta/nestjs-crud';
import {
  {Entity}Interface,
  {Entity}CreatableInterface,
  {Entity}UpdatableInterface,
  {Entity}ModelUpdatableInterface,
  {Entity}Status,
} from './{entity}.interface';

@Exclude()
export class {Entity}Dto extends CommonEntityDto implements {Entity}Interface {
  @Expose()
  @ApiProperty({
    description: '{Entity} name',
    example: 'Example {Entity}',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: '{Entity} name must be at least 1 character' })
  @MaxLength(255, { message: '{Entity} name cannot exceed 255 characters' })
  name!: string;

  @Expose()
  @ApiProperty({
    description: '{Entity} status',
    example: {Entity}Status.ACTIVE,
    enum: {Entity}Status,
  })
  @IsEnum({Entity}Status)
  status!: {Entity}Status;
}

export class {Entity}CreateDto 
  extends PickType({Entity}Dto, ['name'] as const) 
  implements {Entity}CreatableInterface {
    
  @Expose()
  @ApiProperty({
    description: '{Entity} status',
    example: {Entity}Status.ACTIVE,
    enum: {Entity}Status,
    required: false,
  })
  @IsOptional()
  @IsEnum({Entity}Status)
  status?: {Entity}Status;
}

export class {Entity}CreateManyDto {
  @ApiProperty({
    type: [{Entity}CreateDto],
    description: 'Array of {entity}s to create',
  })
  @Type(() => {Entity}CreateDto)
  bulk!: {Entity}CreateDto[];
}

export class {Entity}UpdateDto extends IntersectionType(
  PickType({Entity}Dto, ['id'] as const),
  PartialType(PickType({Entity}Dto, ['name', 'status'] as const)),
) implements {Entity}UpdatableInterface {}

export class {Entity}ModelUpdateDto extends PartialType(
  PickType({Entity}Dto, ['name', 'status'] as const)
) implements {Entity}ModelUpdatableInterface {
  id?: string;
}

export class {Entity}PaginatedDto extends CrudResponsePaginatedDto<{Entity}Dto> {
  @ApiProperty({
    type: [{Entity}Dto],
    description: 'Array of {entity}s',
  })
  data!: {Entity}Dto[];
}
```

### 5. Exception Template

```typescript
// {entity}.exception.ts
import { HttpStatus } from '@nestjs/common';
import { RuntimeException, RuntimeExceptionOptions } from '@concepta/nestjs-common';

export class {Entity}Exception extends RuntimeException {
  constructor(options?: RuntimeExceptionOptions) {
    super(options);
    this.errorCode = '{ENTITY}_ERROR';
  }
}

export class {Entity}NotFoundException extends {Entity}Exception {
  constructor(options?: RuntimeExceptionOptions) {
    super({
      message: 'The {entity} was not found',
      httpStatus: HttpStatus.NOT_FOUND,
      ...options,
    });
    this.errorCode = '{ENTITY}_NOT_FOUND_ERROR';
  }
}

export class {Entity}NameAlreadyExistsException extends {Entity}Exception {
  constructor(options?: RuntimeExceptionOptions) {
    super({
      message: 'A {entity} with this name already exists',
      httpStatus: HttpStatus.CONFLICT,
      ...options,
    });
    this.errorCode = '{ENTITY}_NAME_ALREADY_EXISTS_ERROR';
  }
}

export class {Entity}CannotBeDeletedException extends {Entity}Exception {
  constructor(options?: RuntimeExceptionOptions) {
    super({
      message: 'Cannot delete {entity} because it has associated records',
      httpStatus: HttpStatus.CONFLICT,
      ...options,
    });
    this.errorCode = '{ENTITY}_CANNOT_BE_DELETED_ERROR';
  }
}
```

### 6. Model Service Template

```typescript
// {entity}-model.service.ts
import { Injectable } from '@nestjs/common';
import {
  RepositoryInterface,
  ModelService,
  InjectDynamicRepository,
} from '@concepta/nestjs-common';
import { Like, Not } from 'typeorm';
import { 
  {Entity}EntityInterface, 
  {Entity}CreatableInterface, 
  {Entity}ModelUpdatableInterface, 
  {Entity}ModelServiceInterface,
  {Entity}Status,
} from './{entity}.interface';
import { {Entity}CreateDto, {Entity}ModelUpdateDto } from './{entity}.dto';
import { 
  {Entity}NotFoundException, 
  {Entity}NameAlreadyExistsException 
} from './{entity}.exception';
import { {ENTITY}_MODULE_{ENTITY}_ENTITY_KEY } from './{entity}.constants';

/**
 * {Entity} Model Service
 * 
 * Provides business logic for {entity} operations.
 * Extends the base ModelService and implements custom {entity}-specific methods.
 */
@Injectable()
export class {Entity}ModelService
  extends ModelService<
    {Entity}EntityInterface,
    {Entity}CreatableInterface,
    {Entity}ModelUpdatableInterface
  >
  implements {Entity}ModelServiceInterface
{
  protected createDto = {Entity}CreateDto;
  protected updateDto = {Entity}ModelUpdateDto;

  constructor(
    @InjectDynamicRepository({ENTITY}_MODULE_{ENTITY}_ENTITY_KEY)
    repo: RepositoryInterface<{Entity}EntityInterface>,
  ) {
    super(repo);
  }

  /**
   * Find {entity} by name
   */
  async findByName(name: string): Promise<{Entity}EntityInterface | null> {
    return this.repo.findOne({ 
      where: { name } 
    });
  }

  /**
   * Check if {entity} name is unique (excluding specific ID)
   */
  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const whereCondition: any = { name };
    
    if (excludeId) {
      whereCondition.id = Not(excludeId);
    }

    const existing{Entity} = await this.repo.findOne({
      where: whereCondition,
    });

    return !existing{Entity};
  }

  /**
   * Get all active {entity}s
   */
  async getActive{Entity}s(): Promise<{Entity}EntityInterface[]> {
    return this.repo.find({
      where: { status: {Entity}Status.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  /**
   * Override create method to add business validation
   */
  async create(data: {Entity}CreatableInterface): Promise<{Entity}EntityInterface> {
    // Validate name uniqueness
    const isUnique = await this.isNameUnique(data.name);
    if (!isUnique) {
      throw new {Entity}NameAlreadyExistsException({
        message: `{Entity} with name "${data.name}" already exists`,
      });
    }

    // Set default status if not provided
    const {entity}Data: {Entity}CreatableInterface = {
      ...data,
      status: data.status || {Entity}Status.ACTIVE,
    };

    return super.create({entity}Data);
  }

  /**
   * Override update method to add business validation
   */
  async update(data: {Entity}ModelUpdatableInterface): Promise<{Entity}EntityInterface> {
    const id = data.id;
    if (!id) {
      throw new Error('ID is required for update operation');
    }

    // Check if {entity} exists
    const existing{Entity} = await this.byId(id);
    if (!existing{Entity}) {
      throw new {Entity}NotFoundException({
        message: `{Entity} with ID ${id} not found`,
      });
    }

    // Validate name uniqueness if name is being updated
    if (data.name && data.name !== existing{Entity}.name) {
      const isUnique = await this.isNameUnique(data.name, id);
      if (!isUnique) {
        throw new {Entity}NameAlreadyExistsException({
          message: `{Entity} with name "${data.name}" already exists`,
        });
      }
    }

    return super.update(data);
  }

  /**
   * Get {entity} by ID with proper error handling
   */
  async get{Entity}ById(id: string): Promise<{Entity}EntityInterface> {
    const {entity} = await this.byId(id);
    
    if (!{entity}) {
      throw new {Entity}NotFoundException({
        message: `{Entity} with ID ${id} not found`,
      });
    }
    
    return {entity};
  }
}
```

### 7. Adapter Template

```typescript
// {entity}-typeorm-crud.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { {Entity}Entity } from './{entity}.entity';

@Injectable()
export class {Entity}TypeOrmCrudAdapter extends TypeOrmCrudAdapter<{Entity}Entity> {
  constructor(
    @InjectRepository({Entity}Entity)
    {entity}Repository: Repository<{Entity}Entity>,
  ) {
    super({entity}Repository);
  }
}
```

### 8. CRUD Service Template

```typescript
// {entity}.crud.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CrudService } from '@concepta/nestjs-crud';
import { CrudRequestInterface } from '@concepta/nestjs-crud';
import { {Entity}EntityInterface } from './{entity}.interface';
import { {Entity}TypeOrmCrudAdapter } from './{entity}-typeorm-crud.adapter';
import { {Entity}ModelService } from './{entity}-model.service';
import { {Entity}CreateDto, {Entity}UpdateDto, {Entity}CreateManyDto } from './{entity}.dto';
import { 
  {Entity}Exception 
} from './{entity}.exception';

@Injectable()
export class {Entity}CrudService extends CrudService<{Entity}EntityInterface> {
  constructor(
    @Inject({Entity}TypeOrmCrudAdapter)
    protected readonly crudAdapter: {Entity}TypeOrmCrudAdapter,
    private readonly {entity}ModelService: {Entity}ModelService,
  ) {
    super(crudAdapter);
  }

  async createOne(
    req: CrudRequestInterface<{Entity}EntityInterface>,
    dto: {Entity}CreateDto,
    options?: Record<string, unknown>,
  ): Promise<{Entity}EntityInterface> {
    try {
      return await super.createOne(req, dto, options);
    } catch (error) {
      if (error instanceof {Entity}Exception) {
        throw error;
      }
      throw new {Entity}Exception('Failed to create {entity}', { originalError: error });
    }
  }

  async updateOne(
    req: CrudRequestInterface<{Entity}EntityInterface>,
    dto: {Entity}UpdateDto,
    options?: Record<string, unknown>,
  ): Promise<{Entity}EntityInterface> {
    try {
      return await super.updateOne(req, dto, options);
    } catch (error) {
      if (error instanceof {Entity}Exception) {
        throw error;
      }
      throw new {Entity}Exception('Failed to update {entity}', { originalError: error });
    }
  }

  async deleteOne(
    req: CrudRequestInterface<{Entity}EntityInterface>,
    options?: Record<string, unknown>,
  ): Promise<void | {Entity}EntityInterface> {
    try {
      return await super.deleteOne(req, options);
    } catch (error) {
      if (error instanceof {Entity}Exception) {
        throw error;
      }
      throw new {Entity}Exception('Failed to delete {entity}', { originalError: error });
    }
  }
}
```

### 9. Access Control Template

```typescript
// {entity}-access-query.service.ts
import { Injectable } from '@nestjs/common';
import { AccessControlContextInterface, CanAccess } from '@concepta/nestjs-access-control';

@Injectable()
export class {Entity}AccessQueryService implements CanAccess {
  
  async canAccess(context: AccessControlContextInterface): Promise<boolean> {
    const user = context.getUser();
    const { resource, action } = context.getQuery();

    // Basic implementation - Admin users can do everything, others can only read
    if (!user) {
      return false; // No access for unauthenticated users
    }

    // Allow read operations for all authenticated users
    if (action === 'read') {
      return true;
    }

    // For create/update/delete operations, check admin role
    // TODO: Replace with actual role checking logic
    return !!user; // Placeholder - customize based on business requirements
  }
}
```

### 10. Controller Template

```typescript
// {entity}.crud.controller.ts
import { ApiTags } from '@nestjs/swagger';
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
  {Entity}CreateManyDto, 
  {Entity}CreateDto, 
  {Entity}PaginatedDto, 
  {Entity}UpdateDto, 
  {Entity}Dto 
} from './{entity}.dto';
import { {Entity}AccessQueryService } from './{entity}-access-query.service';
import { {Entity}Resource } from './{entity}.constants';
import { {Entity}CrudService } from './{entity}.crud.service';
import { 
  {Entity}EntityInterface, 
  {Entity}CreatableInterface, 
  {Entity}UpdatableInterface 
} from './{entity}.interface';
import { AuthPublic } from '@concepta/nestjs-authentication';

/**
 * {Entity} CRUD Controller
 * 
 * Provides REST API endpoints for {entity} management using the standard pattern.
 * Handles CRUD operations with proper access control and validation.
 * 
 * BUSINESS RULES:
 * - All operations require appropriate role access (enforced by access control)
 * - {Entity} names must be unique (enforced by service layer)
 * - Uses soft deletion when hard deletion is not possible
 * 
 * Endpoints:
 * - GET /{entity}s - List all {entity}s (paginated)
 * - GET /{entity}s/:id - Get {entity} by ID
 * - POST /{entity}s - Create single {entity}
 * - POST /{entity}s/bulk - Create multiple {entity}s
 * - PATCH /{entity}s/:id - Update {entity}
 * - DELETE /{entity}s/:id - Delete {entity}
 * - POST /{entity}s/:id/recover - Recover soft-deleted {entity}
 */
@CrudController({
  path: '{entity}s',
  model: {
    type: {Entity}Dto,
    paginatedType: {Entity}PaginatedDto,
  },
})
@AccessControlQuery({
  service: {Entity}AccessQueryService,
})
@ApiTags('{entity}s')
@AuthPublic() // Remove this if authentication is required
export class {Entity}CrudController implements CrudControllerInterface<
  {Entity}EntityInterface,
  {Entity}CreatableInterface,
  {Entity}UpdatableInterface
> {
  constructor(private {entity}CrudService: {Entity}CrudService) {}

  @CrudReadMany()
  @AccessControlReadMany({Entity}Resource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>) {
    return this.{entity}CrudService.getMany(crudRequest);
  }

  @CrudReadOne()
  @AccessControlReadOne({Entity}Resource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>) {
    return this.{entity}CrudService.getOne(crudRequest);
  }

  @CrudCreateMany()
  @AccessControlCreateMany({Entity}Resource.Many)
  async createMany(
    @CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>,
    @CrudBody() {entity}CreateManyDto: {Entity}CreateManyDto,
  ) {
    return this.{entity}CrudService.createMany(crudRequest, {entity}CreateManyDto);
  }

  @CrudCreateOne({
    dto: {Entity}CreateDto
  })
  @AccessControlCreateOne({Entity}Resource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>,
    @CrudBody() {entity}CreateDto: {Entity}CreateDto,
  ) {
    return this.{entity}CrudService.createOne(crudRequest, {entity}CreateDto);
  }

  @CrudUpdateOne({
    dto: {Entity}UpdateDto
  })
  @AccessControlUpdateOne({Entity}Resource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>,
    @CrudBody() {entity}UpdateDto: {Entity}UpdateDto,
  ) {
    return this.{entity}CrudService.updateOne(crudRequest, {entity}UpdateDto);
  }

  @CrudDeleteOne()
  @AccessControlDeleteOne({Entity}Resource.One)
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>) {
    return this.{entity}CrudService.deleteOne(crudRequest);
  }

  @CrudRecoverOne()
  @AccessControlRecoverOne({Entity}Resource.One)
  async recoverOne(@CrudRequest() crudRequest: CrudRequestInterface<{Entity}EntityInterface>) {
    return this.{entity}CrudService.recoverOne(crudRequest);
  }
}
```

### 11. Module Template

```typescript
// {entity}.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { {Entity}Entity } from './{entity}.entity';
import { {Entity}CrudController } from './{entity}.crud.controller';
import { {Entity}CrudService } from './{entity}.crud.service';
import { {Entity}ModelService } from './{entity}-model.service';
import { {Entity}TypeOrmCrudAdapter } from './{entity}-typeorm-crud.adapter';
import { {Entity}AccessQueryService } from './{entity}-access-query.service';
import { {ENTITY}_MODULE_{ENTITY}_ENTITY_KEY } from './{entity}.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([{Entity}Entity]),
    TypeOrmExtModule.forFeature({
      [{ENTITY}_MODULE_{ENTITY}_ENTITY_KEY]: { entity: {Entity}Entity },
    }),
  ],
  controllers: [{Entity}CrudController],
  providers: [
    {Entity}TypeOrmCrudAdapter,
    {Entity}ModelService,
    {Entity}CrudService,
    {Entity}AccessQueryService,
  ],
  exports: [{Entity}ModelService, {Entity}TypeOrmCrudAdapter],
})
export class {Entity}Module {}
```

### 12. Index Template

```typescript
// {entity}/index.ts
export * from './{entity}.interface';
export * from './{entity}.entity';
export * from './{entity}.dto';
export * from './{entity}.exception';
export * from './{entity}.constants';
export * from './{entity}-model.service';
export * from './{entity}-typeorm-crud.adapter';
export * from './{entity}.crud.service';
export * from './{entity}-access-query.service';
export * from './{entity}.crud.controller';
export * from './{entity}.module';
```

---

## Replacement Guide

When using templates, replace these placeholders:

| Placeholder | Example | Usage |
|-------------|---------|-------|
| `{Entity}` | `Publisher` | PascalCase class names |
| `{entity}` | `publisher` | Lowercase for variables, file names |
| `{ENTITY}` | `PUBLISHER` | Uppercase for error codes, constants |
| `{Purpose description}` | `Entity management` | Brief description |
| `{access level}` | `read-only` or `full CRUD` | Role permissions |

---

## Quality Checklist

### ✅ Generated Code Must Have:

**File Structure:**
- [ ] All 12 files created in correct order (including constants, index)
- [ ] Consistent naming conventions throughout
- [ ] Proper imports and dependencies

**Entity & Database:**
- [ ] TypeORM entity extends CommonPostgresEntity
- [ ] Primary key, timestamps, status enum
- [ ] Relationships properly defined
- [ ] Entity implements EntityInterface

**DTOs & Validation:**
- [ ] Base DTO extends CommonEntityDto
- [ ] Create/Update DTOs use PickType and IntersectionType patterns
- [ ] All fields have validation decorators
- [ ] ApiProperty documentation complete
- [ ] Pagination DTO extends CrudResponsePaginatedDto

**Constants & Resources:**
- [ ] Constants file with module entity key
- [ ] Resource definitions for access control
- [ ] Proper imports from constants file

**Error Handling:**
- [ ] Base exception extends RuntimeException
- [ ] Specific exceptions for business rules
- [ ] HTTP status codes set correctly
- [ ] Error codes follow naming convention

**Business Logic:**
- [ ] Model service extends ModelService base class
- [ ] Model service implements ModelServiceInterface
- [ ] Protected createDto and updateDto properties defined
- [ ] Business validation in create/update methods
- [ ] Custom business methods (findByName, isNameUnique, etc.)

**CRUD Adapter:**
- [ ] Adapter extends TypeOrmCrudAdapter base class
- [ ] Simple constructor with repository injection
- [ ] Clean, minimal implementation

**CRUD Service:**
- [ ] Service extends CrudService base class
- [ ] Proper error handling with EntityException pattern
- [ ] Try-catch blocks for create/update/delete operations

**Access Control:**
- [ ] Access service implements CanAccess interface
- [ ] Basic canAccess method (customize as needed)
- [ ] Controller decorators applied correctly

**Controller:**
- [ ] Uses @CrudController decorator with proper configuration
- [ ] All CRUD endpoints implemented
- [ ] Access control decorators on all endpoints
- [ ] Proper JSDoc documentation with business rules
- [ ] @AuthPublic() decorator if authentication is optional

**Module Configuration:**
- [ ] Both TypeORM imports (standard + extended)
- [ ] All services registered in providers
- [ ] Proper exports for reusability
- [ ] Controller registered
- [ ] Constants imported and used correctly

### ❌ Common AI Generation Issues to Fix:

- **Missing constants import**: Ensure resource constants come from {entity}.constants.ts
- **Wrong DTO patterns**: Use PickType and IntersectionType correctly, not copy-paste fields
- **Missing ModelUpdatableInterface**: Separate interface for model service updates
- **Overly complex adapters**: Keep adapters simple - just extend TypeOrmCrudAdapter
- **Missing base class extensions**: Model service must extend ModelService, Entity must extend CommonPostgresEntity
- **Missing access control**: Every endpoint must have access decorators
- **Incorrect relationships**: Verify foreign key columns and decorators
- **Missing validation**: Every DTO field needs appropriate validators
- **Wrong file naming**: Follow kebab-case for files, PascalCase for classes
- **Missing business logic**: Model service should have findByName, isNameUnique methods
- **Missing JSDoc**: Controllers need comprehensive documentation

---

## AI Optimization Tips

### **Effective Prompting:**

1. **Be Specific**: Reference TECHNICAL_SPECIFICATION.md for business rules and role permissions
2. **Reference Patterns**: Mention existing modules in codebase to follow as examples
3. **Request Order**: Ask for files in the specified order for dependencies
4. **Include Context**: Extract entity purpose and relationships from TECHNICAL_SPECIFICATION.md
5. **Specify Patterns**: Mention established patterns, EntityException, CanAccess interface explicitly

### **Iterative Improvements:**

1. **Generate Base Structure**: Get all files created first
2. **Add Business Logic**: Enhance validation and business rules
3. **Refine Access Control**: Add specific role-based logic
4. **Add Relationships**: Connect to other entities
5. **Enhance Testing**: Add unit tests and integration tests

### **Validation Prompts:**

```
Review the generated {Entity} module and ensure:
1. All 12 files follow the established patterns (including constants, index)
2. Model service extends ModelService base class and implements ModelServiceInterface
3. Entity extends CommonPostgresEntity and implements EntityInterface
4. Adapter keeps methods simple - just extend TypeOrmCrudAdapter
5. DTOs use PickType and IntersectionType patterns correctly
6. Access control has basic canAccess method (can be customized later)
7. Module has correct TypeORM imports (standard + extended)
8. Constants file includes module entity key and resource definitions
9. All imports reference constants file where appropriate
10. Controller has comprehensive JSDoc with business rules

Fix any issues found and provide the corrected implementation.
```

---

## Success Metrics

**Generated code is AI-optimized when:**
- ✅ Zero manual fixes needed after generation
- ✅ Business rules from TECHNICAL_SPECIFICATION.md implemented correctly
- ✅ Proper error handling throughout
- ✅ Access control follows project requirements
- ✅ Code compiles without TypeScript errors
- ✅ Follows established patterns consistently
- ✅ Complete API documentation in Swagger
- ✅ Constants properly organized and imported

Use these templates and guidelines to achieve consistent, high-quality code generation with AI tools.