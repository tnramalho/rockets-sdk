import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BaseProfileCreateDto,
  BaseProfileUpdateDto,
  ProfileCreatableInterface,
  ProfileModelUpdatableInterface,
} from '../../modules/profile/interfaces/profile.interface';

/**
 * Example profile create DTO
 * This shows how clients can extend the base DTO with their own fields
 */
export interface ExampleProfileFields {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  preferences?: Record<string, unknown>;
}

export class ExampleProfileCreateDto
  extends BaseProfileCreateDto
  implements ProfileCreatableInterface
{
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Software Developer',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'New York, NY',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'User website',
    example: 'https://johndoe.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'User social links',
    example: { twitter: '@johndoe', linkedin: 'johndoe' },
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'User preferences',
    example: { theme: 'dark', notifications: true },
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;

  [key: string]: unknown;
}

/**
 * Example profile update DTO
 * This shows how clients can extend the base DTO with their own fields
 */
export class ExampleProfileUpdateDto
  extends BaseProfileUpdateDto
  implements ProfileModelUpdatableInterface
{
  @ApiProperty({
    description: 'Profile ID',
    example: 'profile-123',
  })
  @IsString()
  id!: string;
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Software Developer',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'New York, NY',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'User website',
    example: 'https://johndoe.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'User social links',
    example: { twitter: '@johndoe', linkedin: 'johndoe' },
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'User preferences',
    example: { theme: 'dark', notifications: true },
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;

  [key: string]: unknown;
}
