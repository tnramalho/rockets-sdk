import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Generic User Update DTO
 * This DTO is generic and uses dynamic profile structure
 * The actual profile validation is handled by the dynamically configured DTO classes
 * Follows SDK patterns for DTOs
 */
export class UserUpdateDto {
  @ApiPropertyOptional({
    description: 'Profile data to update - structure is defined dynamically',
    type: 'object',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      bio: 'Software Developer',
    },
  })
  @IsOptional()
  @IsObject()
  profile?: Record<string, unknown>;
}

/**
 * Generic User Response DTO
 * Contains auth user data + metadata
 * Follows SDK patterns for response DTOs
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'User ID from auth provider',
    example: 'user-123',
  })
  id: string;

  @ApiProperty({
    description: 'User subject from auth provider',
    example: 'user-123',
  })
  sub: string;

  @ApiProperty({
    description: 'User email from auth provider',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'User roles from auth provider',
    example: ['user', 'admin'],
    required: false,
  })
  roles?: string[];

  @ApiProperty({
    description: 'User claims from auth provider',
    example: { iss: 'auth-provider', aud: 'app' },
    required: false,
  })
  claims?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Profile data to update - structure is defined dynamically',
    type: 'object',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      bio: 'Software Developer',
    },
  })
  @IsOptional()
  @IsObject()
  profile?: Record<string, unknown>;
}
