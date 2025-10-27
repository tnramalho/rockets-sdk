# 🔄 CRUD PATTERNS GUIDE

> **For AI Tools**: This guide contains CRUD implementation patterns for Rockets SDK. Use this when building entities that need CRUD operations with the latest API patterns.

## 📋 **Quick Reference**

| Pattern | When to Use | Complexity | Recommended |
|---------|-------------|------------|-------------|
| [Direct CRUD](#direct-crud-pattern) | Standard CRUD, fixed DTOs, explicit control | Low | ✅ **RECOMMENDED** |
| [Custom Controllers](#custom-controllers) | Special business logic, non-standard operations | Medium | ⚠️ *As needed* |

---

## ✅ Prerequisite: Initialize CrudModule in the root AppModule

Before using any CRUD decorators or calling `CrudModule.forFeature(...)` in feature modules, you must initialize the CRUD infrastructure once at the application root with `CrudModule.forRoot({})`.

```typescript
// app.module.ts
@Module({
  imports: [
    CrudModule.forRoot({}),
    // ...other modules
  ],
})
export class AppModule {}
```

If you skip this, NestJS will fail to resolve `CRUD_MODULE_SETTINGS_TOKEN` and show an error mentioning `Symbol(__CRUD_MODULE_RAW_OPTIONS_TOKEN__)` in the `CrudModule` context.

## 🎯 **Pattern Decision Tree**

```
Need CRUD operations for your entity?
├── Yes → **RECOMMENDED: Use Direct CRUD Pattern**
│   ├── ✅ Explicit control over all endpoints
│   ├── ✅ Clear business logic placement
│   ├── ✅ Easy debugging and maintenance
│   ├── ✅ Access control integration
│   └── ✅ Full error handling
└── Special requirements → Custom Controllers

Use Direct CRUD for all standard entity operations.
```

---

## 🚀 **Direct CRUD Pattern** ⭐ **RECOMMENDED**

### **When to Use:**
- ✅ **All new CRUD implementations** 
- ✅ Standard entity operations (Create, Read, Update, Delete)
- ✅ Fixed DTOs and adapters
- ✅ Explicit control over endpoints
- ✅ Access control integration
- ✅ Business validation requirements

### **Architecture Overview:**

```
Controller → CRUD Service → Model Service → Adapter → Database
     ↑            ↑              ↑           ↑
Access Control | Business Logic | Validation | TypeORM
```

### **Complete Implementation:**

#### **1. Controller Layer**

```typescript
// artist.crud.controller.ts
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
  ArtistCreateManyDto, 
  ArtistCreateDto, 
  ArtistPaginatedDto, 
  ArtistUpdateDto, 
  ArtistDto 
} from './artist.dto';
import { ArtistAccessQueryService } from './artist-access-query.service';
import { ArtistResource } from './artist.constants'; // Updated import
import { ArtistCrudService } from './artist.crud.service';
import { 
  ArtistEntityInterface, 
  ArtistCreatableInterface, 
  ArtistUpdatableInterface 
} from './artist.interface';
import { AuthPublic } from '@concepta/nestjs-authentication'; // New import

/**
 * Artist CRUD Controller
 * 
 * Provides REST API endpoints for artist management using the latest patterns.
 * Handles CRUD operations with proper access control and validation.
 * 
 * BUSINESS RULES:
 * - All operations require appropriate role access (enforced by access control)
 * - Artist names must be unique (enforced by service layer)
 * - Uses soft deletion when hard deletion is not possible
 */
@CrudController({
  path: 'artists',
  model: {
    type: ArtistDto,
    paginatedType: ArtistPaginatedDto,
  },
})
@AccessControlQuery({
  service: ArtistAccessQueryService,
})
@ApiTags('artists')
@AuthPublic() // Remove this if authentication is required
export class ArtistCrudController implements CrudControllerInterface<
  ArtistEntityInterface,
  ArtistCreatableInterface,
  ArtistUpdatableInterface
> {
  constructor(private artistCrudService: ArtistCrudService) {}

  @CrudReadMany()
  @AccessControlReadMany(ArtistResource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>) {
    return this.artistCrudService.getMany(crudRequest);
  }

  @CrudReadOne()
  @AccessControlReadOne(ArtistResource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>) {
    return this.artistCrudService.getOne(crudRequest);
  }

  @CrudCreateMany()
  @AccessControlCreateMany(ArtistResource.Many)
  async createMany(
    @CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>,
    @CrudBody() artistCreateManyDto: ArtistCreateManyDto,
  ) {
    return this.artistCrudService.createMany(crudRequest, artistCreateManyDto);
  }

  @CrudCreateOne({
    dto: ArtistCreateDto
  })
  @AccessControlCreateOne(ArtistResource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>,
    @CrudBody() artistCreateDto: ArtistCreateDto,
  ) {
    return this.artistCrudService.createOne(crudRequest, artistCreateDto);
  }

  @CrudUpdateOne({
    dto: ArtistUpdateDto
  })
  @AccessControlUpdateOne(ArtistResource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>,
    @CrudBody() artistUpdateDto: ArtistUpdateDto,
  ) {
    return this.artistCrudService.updateOne(crudRequest, artistUpdateDto);
  }

  @CrudDeleteOne()
  @AccessControlDeleteOne(ArtistResource.One)
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>) {
    return this.artistCrudService.deleteOne(crudRequest);
  }

  @CrudRecoverOne()
  @AccessControlRecoverOne(ArtistResource.One)
  async recoverOne(@CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>) {
    return this.artistCrudService.recoverOne(crudRequest);
  }
}
```

#### **2. CRUD Service Layer**

```typescript
// artist.crud.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CrudService } from '@concepta/nestjs-crud';
import { CrudRequestInterface } from '@concepta/nestjs-crud';
import { ArtistEntityInterface } from './artist.interface';
import { ArtistTypeOrmCrudAdapter } from './artist-typeorm-crud.adapter';
import { ArtistModelService } from './artist-model.service';
import { 
  ArtistCreateDto, 
  ArtistUpdateDto, 
  ArtistCreateManyDto 
} from './artist.dto';
import { 
  ArtistException 
} from './artist.exception';

@Injectable()
export class ArtistCrudService extends CrudService<ArtistEntityInterface> {
  constructor(
    @Inject(ArtistTypeOrmCrudAdapter)
    protected readonly crudAdapter: ArtistTypeOrmCrudAdapter,
    private readonly artistModelService: ArtistModelService,
  ) {
    super(crudAdapter);
  }

  /**
   * Create one artist with business validation
   */
  async createOne(
    req: CrudRequestInterface<ArtistEntityInterface>,
    dto: ArtistCreateDto,
    options?: Record<string, unknown>,
  ): Promise<ArtistEntityInterface> {
    try {
      return await super.createOne(req, dto, options);
    } catch (error) {
      if (error instanceof ArtistException) {
        throw error;
      }
      throw new ArtistException('Failed to create artist', { originalError: error });
    }
  }

  /**
   * Update one artist with business validation
   */
  async updateOne(
    req: CrudRequestInterface<ArtistEntityInterface>,
    dto: ArtistUpdateDto,
    options?: Record<string, unknown>,
  ): Promise<ArtistEntityInterface> {
    try {
      return await super.updateOne(req, dto, options);
    } catch (error) {
      if (error instanceof ArtistException) {
        throw error;
      }
      throw new ArtistException('Failed to update artist', { originalError: error });
    }
  }

  /**
   * Delete one artist with business validation
   */
  async deleteOne(
    req: CrudRequestInterface<ArtistEntityInterface>,
    options?: Record<string, unknown>,
  ): Promise<void | ArtistEntityInterface> {
    try {
      return await super.deleteOne(req, options);
    } catch (error) {
      if (error instanceof ArtistException) {
        throw error;
      }
      throw new ArtistException('Failed to delete artist', { originalError: error });
    }
  }

  /**
   * Create many artists with business validation
   */
  async createMany(
    req: CrudRequestInterface<ArtistEntityInterface>,
    dto: ArtistCreateManyDto,
    options?: Record<string, unknown>,
  ): Promise<ArtistEntityInterface[]> {
    try {
      return await super.createMany(req, dto, options);
    } catch (error) {
      if (error instanceof ArtistException) {
        throw error;
      }
      throw new ArtistException('Failed to create artists', { originalError: error });
    }
  }
}
```

#### **3. Model Service Layer**

```typescript
// artist-model.service.ts
import { Injectable } from '@nestjs/common';
import {
  RepositoryInterface,
  ModelService,
  InjectDynamicRepository,
} from '@concepta/nestjs-common';
import { Not } from 'typeorm';
import { 
  ArtistEntityInterface, 
  ArtistCreatableInterface, 
  ArtistModelUpdatableInterface, 
  ArtistModelServiceInterface,
  ArtistStatus,
} from './artist.interface';
import { ArtistCreateDto, ArtistModelUpdateDto } from './artist.dto';
import { 
  ArtistNotFoundException, 
  ArtistNameAlreadyExistsException 
} from './artist.exception';
import { ARTIST_MODULE_ARTIST_ENTITY_KEY } from './artist.constants';

/**
 * Artist Model Service
 * 
 * Provides business logic for artist operations.
 * Extends the base ModelService and implements custom artist-specific methods.
 */
@Injectable()
export class ArtistModelService
  extends ModelService<
    ArtistEntityInterface,
    ArtistCreatableInterface,
    ArtistModelUpdatableInterface
  >
  implements ArtistModelServiceInterface
{
  protected createDto = ArtistCreateDto;
  protected updateDto = ArtistModelUpdateDto;

  constructor(
    @InjectDynamicRepository(ARTIST_MODULE_ARTIST_ENTITY_KEY)
    repo: RepositoryInterface<ArtistEntityInterface>,
  ) {
    super(repo);
  }

  /**
   * Find artist by name
   */
  async findByName(name: string): Promise<ArtistEntityInterface | null> {
    return this.repo.findOne({ 
      where: { name } 
    });
  }

  /**
   * Check if artist name is unique (excluding specific ID)
   */
  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const whereCondition: any = { name };
    
    if (excludeId) {
      whereCondition.id = Not(excludeId);
    }

    const existingArtist = await this.repo.findOne({
      where: whereCondition,
    });

    return !existingArtist;
  }

  /**
   * Get all active artists
   */
  async getActiveArtists(): Promise<ArtistEntityInterface[]> {
    return this.repo.find({
      where: { status: ArtistStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  /**
   * Override create method to add business validation
   */
  async create(data: ArtistCreatableInterface): Promise<ArtistEntityInterface> {
    // Validate name uniqueness
    const isUnique = await this.isNameUnique(data.name);
    if (!isUnique) {
      throw new ArtistNameAlreadyExistsException({
        message: `Artist with name "${data.name}" already exists`,
      });
    }

    // Set default status if not provided
    const artistData: ArtistCreatableInterface = {
      ...data,
      status: data.status || ArtistStatus.ACTIVE,
    };

    return super.create(artistData);
  }

  /**
   * Override update method to add business validation
   */
  async update(data: ArtistModelUpdatableInterface): Promise<ArtistEntityInterface> {
    const id = data.id;
    if (!id) {
      throw new Error('ID is required for update operation');
    }

    // Check if artist exists
    const existingArtist = await this.byId(id);
    if (!existingArtist) {
      throw new ArtistNotFoundException({
        message: `Artist with ID ${id} not found`,
      });
    }

    // Validate name uniqueness if name is being updated
    if (data.name && data.name !== existingArtist.name) {
      const isUnique = await this.isNameUnique(data.name, id);
      if (!isUnique) {
        throw new ArtistNameAlreadyExistsException({
          message: `Artist with name "${data.name}" already exists`,
        });
      }
    }

    return super.update(data);
  }
}
```

#### **4. TypeORM Adapter Layer**

```typescript
// artist-typeorm-crud.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { ArtistEntity } from './artist.entity';

/**
 * Artist TypeORM CRUD Adapter
 * 
 * Simple adapter that extends TypeOrmCrudAdapter.
 * Provides database access layer for artist operations.
 */
@Injectable()
export class ArtistTypeOrmCrudAdapter extends TypeOrmCrudAdapter<ArtistEntity> {
  constructor(
    @InjectRepository(ArtistEntity)
    artistRepository: Repository<ArtistEntity>,
  ) {
    super(artistRepository);
  }
}
```

---

## 🔧 **Key Patterns Explained**

### **1. Layered Architecture**

```typescript
// Clear separation of concerns
Controller  → API endpoints + access control
CRUD Service → CRUD operations + error handling  
Model Service → Business logic + validation
Adapter → Database operations
```

### **2. Error Handling Pattern**

```typescript
// Consistent error handling across all operations
try {
  return await super.createOne(req, dto, options);
} catch (error) {
  if (error instanceof ArtistException) {
    throw error; // Re-throw business exceptions
  }
  throw new ArtistException('Failed to create artist', { originalError: error });
}
```

### **3. Business Validation**

```typescript
// Business rules in model service
async create(data: ArtistCreatableInterface): Promise<ArtistEntityInterface> {
  // 1. Validate business rules (name uniqueness)
  const isUnique = await this.isNameUnique(data.name);
  if (!isUnique) {
    throw new ArtistNameAlreadyExistsException();
  }

  // 2. Set defaults
  const artistData = {
    ...data,
    status: data.status || ArtistStatus.ACTIVE,
  };

  // 3. Call parent method
  return super.create(artistData);
}
```

### **4. Access Control Integration**

```typescript
// Every endpoint has access control
@CrudReadMany()
@AccessControlReadMany(ArtistResource.Many) // Resource from constants
async getMany(@CrudRequest() crudRequest: CrudRequestInterface<ArtistEntityInterface>) {
  return this.artistCrudService.getMany(crudRequest);
}
```

### **5. Constants Usage**

```typescript
// Import resources from constants file
import { ArtistResource } from './artist.constants';

// Use in decorators
@AccessControlReadMany(ArtistResource.Many)

// Constants file structure
export const ArtistResource = {
  One: 'artist-one',
  Many: 'artist-many',
} as const;
```

---

## 🎯 **Custom Controllers** (When Needed)

### **When to Use Custom Controllers:**
- ✅ Special business operations not covered by CRUD
- ✅ Complex data transformations
- ✅ Multi-entity operations
- ✅ File uploads or downloads
- ✅ Reporting endpoints

### **Example: Custom Business Endpoint**

```typescript
// artist.custom.controller.ts
@Controller('artists')
@ApiTags('artists-custom')
export class ArtistCustomController {
  constructor(private artistModelService: ArtistModelService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get all active artists' })
  async getActiveArtists(): Promise<ArtistDto[]> {
    const artists = await this.artistModelService.getActiveArtists();
    return artists.map(artist => new ArtistDto(artist));
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate an artist' })
  async deactivateArtist(
    @Param('id') id: string
  ): Promise<ArtistDto> {
    const artist = await this.artistModelService.deactivateArtist(id);
    return new ArtistDto(artist);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search artists by name' })
  async searchArtists(
    @Query('name') name: string
  ): Promise<ArtistDto[]> {
    // Custom search logic
    const artists = await this.artistModelService.searchByName(name);
    return artists.map(artist => new ArtistDto(artist));
  }
}
```

---

## 📊 **CRUD vs Custom Decision Matrix**

| Operation | Use CRUD | Use Custom |
|-----------|----------|------------|
| Get all entities | ✅ `getMany()` | ❌ |
| Get entity by ID | ✅ `getOne()` | ❌ |
| Create entity | ✅ `createOne()` | ❌ |
| Update entity | ✅ `updateOne()` | ❌ |
| Delete entity | ✅ `deleteOne()` | ❌ |
| Bulk create | ✅ `createMany()` | ❌ |
| Search/filter | ✅ Query params | ⚠️ Complex searches |
| Get active only | ❌ | ✅ Custom endpoint |
| Bulk operations | ❌ | ✅ Custom endpoint |
| File uploads | ❌ | ✅ Custom endpoint |
| Reports/analytics | ❌ | ✅ Custom endpoint |
| Multi-entity ops | ❌ | ✅ Custom endpoint |

---

## ✅ **Best Practices**

### **1. Always Use Direct CRUD for Standard Operations**
```typescript
// ✅ Good - Standard CRUD
@CrudController({ path: 'artists' })
export class ArtistCrudController implements CrudControllerInterface {}

// ❌ Avoid - Custom implementation of standard CRUD
@Controller('artists')
export class ArtistController {
  @Get() getAllArtists() {} // Don't reinvent CRUD
}
```

### **2. Put Business Logic in Model Service**
```typescript
// ✅ Good - Business logic in model service
async create(data: ArtistCreatableInterface) {
  const isUnique = await this.isNameUnique(data.name);
  if (!isUnique) throw new ArtistNameAlreadyExistsException();
  return super.create(data);
}

// ❌ Avoid - Business logic in controller
@Post()
async createArtist(@Body() dto: ArtistCreateDto) {
  // Don't put validation logic here
}
```

### **3. Handle Errors Consistently**
```typescript
// ✅ Good - Consistent error handling
try {
  return await super.createOne(req, dto, options);
} catch (error) {
  if (error instanceof ArtistException) throw error;
  throw new ArtistException('Failed to create artist', { originalError: error });
}
```

### **4. Use Constants for Resources**
```typescript
// ✅ Good - Import from constants
import { ArtistResource } from './artist.constants';
@AccessControlReadMany(ArtistResource.Many)

// ❌ Avoid - Hard-coded strings
@AccessControlReadMany('artist-many')
```

### **5. Keep Adapters Simple**
```typescript
// ✅ Good - Simple adapter
export class ArtistTypeOrmCrudAdapter extends TypeOrmCrudAdapter<ArtistEntity> {
  constructor(@InjectRepository(ArtistEntity) repo: Repository<ArtistEntity>) {
    super(repo);
  }
}

// ❌ Avoid - Complex logic in adapter
```

---

## 🚀 **Integration with Module System**

### **Module Configuration:**
```typescript
// artist.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity]),
    TypeOrmExtModule.forFeature({
      [ARTIST_MODULE_ARTIST_ENTITY_KEY]: { entity: ArtistEntity },
    }),
  ],
  controllers: [
    ArtistCrudController,
    ArtistCustomController, // Add custom controller if needed
  ],
  providers: [
    ArtistTypeOrmCrudAdapter,
    ArtistModelService,
    ArtistCrudService,
    ArtistAccessQueryService,
  ],
  exports: [ArtistModelService, ArtistTypeOrmCrudAdapter],
})
export class ArtistModule {}
```

---

## ⚡ **Performance Tips**

### **1. Use Eager Loading for Relationships**
```typescript
// In entity definition
@ManyToOne(() => GenreEntity, { eager: true })
genre: GenreEntity;
```

### **2. Implement Proper Indexing**
```typescript
// In entity definition
@Index(['name']) // Add database index
@Column({ unique: true })
name: string;
```

### **3. Use Query Optimization**
```typescript
// In model service - Use QueryBuilder for complex queries
async findActiveWithAlbums(): Promise<ArtistEntityInterface[]> {
  return this.repo.createQueryBuilder('artist')
    .leftJoinAndSelect('artist.albums', 'album')
    .where('artist.status = :status', { status: ArtistStatus.ACTIVE })
    .orderBy('artist.name', 'ASC')
    .getMany();
}
```

---

## 🎯 **Success Metrics**

**Your CRUD implementation is optimized when:**
- ✅ All standard operations use Direct CRUD pattern
- ✅ Business logic is centralized in model service
- ✅ Error handling is consistent across all operations
- ✅ Access control is properly implemented
- ✅ Custom endpoints only for non-standard operations
- ✅ Adapters are simple and focused
- ✅ Constants are used for all resource definitions

**🚀 Build robust CRUD operations with the Direct CRUD pattern!**

---

## 🔗 **Related Guides**

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Test CRUD operations
- [ACCESS_CONTROL_GUIDE.md](./ACCESS_CONTROL_GUIDE.md) - Secure CRUD endpoints
- [AI_TEMPLATES_GUIDE.md](./AI_TEMPLATES_GUIDE.md) - Generate complete modules
- [ROCKETS_AI_INDEX.md](./ROCKETS_AI_INDEX.md) - Navigation hub