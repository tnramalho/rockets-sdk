# 📋 DTO PATTERNS GUIDE

> **For AI Tools**: This guide contains all DTO creation patterns and validation strategies for Rockets SDK. Use this when building API contracts and validation schemas with the latest patterns.

## 📋 **Quick Reference**

| Task | Section | Time |
|------|---------|------|
| Create main entity DTO | [Base DTO Pattern](#base-dto-pattern) | 10 min |
| Create/Update DTOs | [CRUD DTO Patterns](#crud-dto-patterns) | 15 min |
| Add validation decorators | [Validation Patterns](#validation-patterns) | 10 min |
| Paginated responses | [Pagination DTOs](#pagination-dtos) | 5 min |
| Handle relationships | [Relationship DTOs](#relationship-dtos) | 15 min |

---

## 🏗️ **Base DTO Pattern**

### **Main Entity DTO Structure**

All entity DTOs should follow this standardized pattern:

```typescript
// artist.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  Min,
  Max,
  IsEmail,
  IsUrl,
  IsDate,
  IsNumber,
  IsPositive,
  Transform,
  ValidateIf,
  IsObject,
} from 'class-validator';
import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger';
import { CommonEntityDto } from '@concepta/nestjs-common';
import { CrudResponsePaginatedDto } from '@concepta/nestjs-crud';
import {
  ArtistInterface,
  ArtistCreatableInterface,
  ArtistUpdatableInterface,
  ArtistModelUpdatableInterface,
  ArtistStatus,
} from './artist.interface';

/**
 * Main Artist DTO
 * Used for API responses showing artist data
 */
@Exclude() // Exclude all properties by default for security
export class ArtistDto extends CommonEntityDto implements ArtistInterface {
  @Expose() // Explicitly expose needed properties
  @ApiProperty({
    description: 'Artist name',
    example: 'The Beatles',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Artist name must be at least 1 character' })
  @MaxLength(255, { message: 'Artist name cannot exceed 255 characters' })
  name!: string;

  @Expose()
  @ApiProperty({
    description: 'Artist status',
    example: ArtistStatus.ACTIVE,
    enum: ArtistStatus,
  })
  @IsEnum(ArtistStatus)
  status!: ArtistStatus;

  @Expose()
  @ApiProperty({
    description: 'Artist biography',
    example: 'British rock band formed in Liverpool in 1960',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Biography cannot exceed 2000 characters' })
  biography?: string;

  @Expose()
  @ApiProperty({
    description: 'Artist country of origin',
    example: 'United Kingdom',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country cannot exceed 100 characters' })
  country?: string;
}
```

### **Key Patterns:**

✅ **Extend CommonEntityDto**: Provides `id`, `dateCreated`, `dateUpdated`, `dateDeleted`  
✅ **Use @Exclude()**: Start with exclusion for security, explicitly expose needed fields  
✅ **Implement Interface**: Ensure type safety with business interface  
✅ **Complete ApiProperty**: Full Swagger documentation with examples and constraints  
✅ **Validation Decorators**: Both class-validator rules and custom error messages  
✅ **Optional Fields**: Use `@IsOptional()` with proper typing

---

## 🔄 **CRUD DTO Patterns**

### **Create DTO Pattern**

```typescript
/**
 * Artist Create DTO
 * Used for creating new artists
 */
export class ArtistCreateDto 
  extends PickType(ArtistDto, ['name'] as const) 
  implements ArtistCreatableInterface {
  
  @Expose()
  @ApiProperty({
    description: 'Artist status',
    example: ArtistStatus.ACTIVE,
    enum: ArtistStatus,
    required: false,
    default: ArtistStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ArtistStatus)
  status?: ArtistStatus;

  @Expose()
  @ApiProperty({
    description: 'Artist biography',
    example: 'British rock band formed in Liverpool in 1960',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Biography cannot exceed 2000 characters' })
  biography?: string;

  @Expose()
  @ApiProperty({
    description: 'Artist country of origin',
    example: 'United Kingdom',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country cannot exceed 100 characters' })
  country?: string;
}
```

### **Create Many DTO Pattern**

```typescript
/**
 * Artist Create Many DTO
 * Used for bulk creation operations
 */
export class ArtistCreateManyDto {
  @ApiProperty({
    type: [ArtistCreateDto],
    description: 'Array of artists to create',
    example: [
      { name: 'The Beatles', status: ArtistStatus.ACTIVE },
      { name: 'The Rolling Stones', status: ArtistStatus.ACTIVE },
    ],
  })
  @Type(() => ArtistCreateDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one artist must be provided' })
  @ArrayMaxSize(100, { message: 'Cannot create more than 100 artists at once' })
  bulk!: ArtistCreateDto[];
}
```

### **Update DTO Pattern**

```typescript
/**
 * Artist Update DTO
 * Used for updating existing artists
 * Combines required ID with optional fields
 */
export class ArtistUpdateDto extends IntersectionType(
  PickType(ArtistDto, ['id'] as const),
  PartialType(PickType(ArtistDto, ['name', 'status', 'biography', 'country'] as const)),
) implements ArtistUpdatableInterface {}
```

### **Model Update DTO Pattern**

```typescript
/**
 * Artist Model Update DTO
 * Used internally by model service for updates
 * Allows partial updates without requiring ID in body
 */
export class ArtistModelUpdateDto extends PartialType(
  PickType(ArtistDto, ['name', 'status', 'biography', 'country'] as const)
) implements ArtistModelUpdatableInterface {
  id?: string; // Optional ID for internal use
}
```

---

## 📄 **Pagination DTOs**

### **Paginated Response DTO**

```typescript
/**
 * Artist Paginated DTO
 * Used for paginated list responses
 */
export class ArtistPaginatedDto extends CrudResponsePaginatedDto<ArtistDto> {
  @ApiProperty({
    type: [ArtistDto],
    description: 'Array of artists',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'The Beatles',
        status: ArtistStatus.ACTIVE,
        dateCreated: '2023-01-01T00:00:00Z',
        dateUpdated: '2023-01-01T00:00:00Z',
      },
    ],
  })
  data!: ArtistDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### **Search/Filter DTO**

```typescript
/**
 * Artist Search DTO
 * Used for search and filtering operations
 */
export class ArtistSearchDto {
  @ApiProperty({
    description: 'Search by artist name',
    example: 'Beatles',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Search term must be at least 2 characters' })
  name?: string;

  @ApiProperty({
    description: 'Filter by status',
    enum: ArtistStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ArtistStatus)
  status?: ArtistStatus;

  @ApiProperty({
    description: 'Filter by country',
    example: 'United Kingdom',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

---

## 🔗 **Relationship DTOs**

### **Entity with Relationships**

```typescript
/**
 * Artist with Albums DTO
 * Used when returning artist data with related albums
 */
export class ArtistWithAlbumsDto extends ArtistDto {
  @Expose()
  @ApiProperty({
    type: [AlbumDto],
    description: 'Albums by this artist',
    required: false,
  })
  @Type(() => AlbumDto)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  albums?: AlbumDto[];

  @Expose()
  @ApiProperty({
    description: 'Total number of albums',
    example: 13,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  albumCount?: number;
}
```

### **Nested Create DTO**

```typescript
/**
 * Album Create with Artist DTO
 * Used for creating album with artist reference
 */
export class AlbumCreateWithArtistDto extends AlbumCreateDto {
  @ApiProperty({
    description: 'Artist ID for this album',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID(4, { message: 'Artist ID must be a valid UUID' })
  artistId!: string;

  @ApiProperty({
    description: 'Alternatively, create new artist inline',
    type: ArtistCreateDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArtistCreateDto)
  artist?: ArtistCreateDto;
}
```

---

## ✅ **Validation Patterns**

### **String Validation**

```typescript
// Basic string with length constraints
@IsString()
@IsNotEmpty()
@MinLength(1, { message: 'Name is required' })
@MaxLength(255, { message: 'Name cannot exceed 255 characters' })
name!: string;

// Optional string with validation
@IsOptional()
@IsString()
@MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
description?: string;

// Email validation
@IsEmail({}, { message: 'Please provide a valid email address' })
@MaxLength(320, { message: 'Email cannot exceed 320 characters' })
email!: string;

// URL validation
@IsOptional()
@IsUrl({}, { message: 'Please provide a valid URL' })
website?: string;
```

### **Numeric Validation**

```typescript
// Integer with range
@Type(() => Number)
@IsInt({ message: 'Age must be an integer' })
@Min(0, { message: 'Age cannot be negative' })
@Max(150, { message: 'Age cannot exceed 150' })
age!: number;

// Decimal with precision
@Type(() => Number)
@IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' })
@Min(0.01, { message: 'Price must be at least 0.01' })
@Max(999999.99, { message: 'Price cannot exceed 999,999.99' })
price!: number;

// Positive integer
@Type(() => Number)
@IsPositive({ message: 'Quantity must be positive' })
@IsInt({ message: 'Quantity must be an integer' })
quantity!: number;
```

### **Date Validation**

```typescript
// Date validation
@Type(() => Date)
@IsDate({ message: 'Please provide a valid date' })
releaseDate!: Date;

// Date with range validation
@Type(() => Date)
@IsDate()
@IsOptional()
@Transform(({ value }) => {
  const date = new Date(value);
  const now = new Date();
  if (date > now) {
    throw new Error('Birth date cannot be in the future');
  }
  return date;
})
birthDate?: Date;
```

### **Array Validation**

```typescript
// Array of strings
@IsArray()
@IsString({ each: true })
@ArrayMinSize(1, { message: 'At least one tag is required' })
@ArrayMaxSize(10, { message: 'Cannot have more than 10 tags' })
tags!: string[];

// Array of objects
@IsArray()
@ValidateNested({ each: true })
@Type(() => SongDto)
@ArrayMinSize(1, { message: 'Album must have at least one song' })
songs!: SongDto[];

// Optional array
@IsOptional()
@IsArray()
@IsUUID(4, { each: true, message: 'Each category ID must be a valid UUID' })
categoryIds?: string[];
```

### **Custom Validation**

```typescript
// Custom validator function
function IsNotProfane(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotProfane',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const profaneWords = ['badword1', 'badword2']; // Your profanity list
          return !profaneWords.some(word => 
            value?.toLowerCase().includes(word.toLowerCase())
          );
        },
        defaultMessage(args: ValidationArguments) {
          return 'Text contains inappropriate content';
        },
      },
    });
  };
}

// Usage
@IsString()
@IsNotProfane({ message: 'Artist name cannot contain inappropriate content' })
name!: string;
```

---

## 🎯 **Advanced Patterns**

### **Conditional Validation**

```typescript
export class ConditionalValidationDto {
  @ApiProperty({
    description: 'Content type',
    enum: ['text', 'image', 'video'],
  })
  @IsEnum(['text', 'image', 'video'])
  type!: string;

  @ApiProperty({
    description: 'Text content (required if type is text)',
    required: false,
  })
  @ValidateIf(o => o.type === 'text')
  @IsNotEmpty({ message: 'Text content is required for text type' })
  @IsString()
  textContent?: string;

  @ApiProperty({
    description: 'Image URL (required if type is image)',
    required: false,
  })
  @ValidateIf(o => o.type === 'image')
  @IsNotEmpty({ message: 'Image URL is required for image type' })
  @IsUrl()
  imageUrl?: string;
}
```

### **Transform and Sanitize**

```typescript
export class TransformDto {
  @ApiProperty({
    description: 'Name (will be trimmed and title-cased)',
    example: '  john doe  ',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    }
    return value;
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Tags (will be cleaned and deduplicated)',
    example: ['  Rock  ', 'rock', 'JAZZ', 'jazz'],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      const cleaned = value
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
      return [...new Set(cleaned)]; // Remove duplicates
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}
```

### **File Upload DTO**

```typescript
export class FileUploadDto {
  @ApiProperty({
    description: 'File description',
    example: 'Album cover image',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: 'File category',
    enum: ['image', 'audio', 'document'],
  })
  @IsEnum(['image', 'audio', 'document'])
  category!: string;

  @ApiProperty({
    description: 'File metadata',
    example: { originalName: 'cover.jpg', size: 1024000 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  metadata?: {
    originalName: string;
    size: number;
    mimeType: string;
  };
}
```

---

## ✅ **Best Practices**

### **1. Use Composition Over Inheritance**
```typescript
// ✅ Good - Use PickType and IntersectionType
export class ArtistUpdateDto extends IntersectionType(
  PickType(ArtistDto, ['id'] as const),
  PartialType(PickType(ArtistDto, ['name', 'status'] as const)),
) {}

// ❌ Avoid - Copying fields manually
export class ArtistUpdateDto {
  id: string;
  name?: string;
  status?: ArtistStatus;
}
```

### **2. Provide Meaningful Error Messages**
```typescript
// ✅ Good - Specific error messages
@MinLength(2, { message: 'Artist name must be at least 2 characters long' })
@MaxLength(100, { message: 'Artist name cannot exceed 100 characters' })

// ❌ Avoid - Generic messages or no messages
@MinLength(2)
@MaxLength(100)
```

### **3. Use Transform for Data Cleaning**
```typescript
// ✅ Good - Clean and normalize data
@Transform(({ value }) => value?.trim().toLowerCase())
@IsEmail()
email!: string;

// ❌ Avoid - Accepting dirty data
@IsEmail()
email!: string;
```

### **4. Implement Interface Compliance**
```typescript
// ✅ Good - Implement business interfaces
export class ArtistCreateDto implements ArtistCreatableInterface {
  // DTO implementation
}

// ❌ Avoid - No interface compliance
export class ArtistCreateDto {
  // No type safety
}
```

### **5. Use Proper API Documentation**
```typescript
// ✅ Good - Complete documentation
@ApiProperty({
  description: 'Artist unique identifier',
  example: '123e4567-e89b-12d3-a456-426614174000',
  format: 'uuid',
  readOnly: true,
})

// ❌ Avoid - Minimal or no documentation
@ApiProperty()
```

---

## 🎯 **Success Metrics**

**Your DTO implementation is optimized when:**
- ✅ All DTOs extend appropriate base classes (CommonEntityDto)
- ✅ Proper composition using PickType, PartialType, IntersectionType
- ✅ Complete validation with meaningful error messages
- ✅ Full Swagger documentation with examples
- ✅ Interface compliance for type safety
- ✅ Data transformation and sanitization
- ✅ Consistent naming and structure patterns
- ✅ Relationship handling for complex data

**📋 Build robust APIs with well-designed DTOs!**