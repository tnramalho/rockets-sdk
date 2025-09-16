import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software Developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'User location',
    example: 'New York, NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'User website',
    example: 'https://johndoe.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'User social links',
    example: { twitter: '@johndoe', linkedin: 'johndoe' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiProperty({
    description: 'User preferences',
    example: { theme: 'dark', notifications: true },
    required: false,
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
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software Developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'User location',
    example: 'New York, NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'User website',
    example: 'https://johndoe.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'User social links',
    example: { twitter: '@johndoe', linkedin: 'johndoe' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiProperty({
    description: 'User preferences',
    example: { theme: 'dark', notifications: true },
    required: false,
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;

  [key: string]: unknown;
}
