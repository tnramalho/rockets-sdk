import { Controller, Get, Patch, Body, Inject } from '@nestjs/common';
import { AuthUser } from '@concepta/nestjs-authentication';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { AuthorizedUser } from '../../interfaces/auth-user.interface';
import {
  ProfileEntityInterface,
  ProfileModelServiceInterface,
} from '../profile/interfaces/profile.interface';
import { UserUpdateDto, UserResponseDto } from './user.dto';
import { ProfileModelService } from '../profile/constants/profile.constants';

/**
 * User Controller
 * Provides endpoints for user profile management
 * Follows SDK patterns for controllers
 */
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class MeController {
  constructor(
    @Inject(ProfileModelService)
    private readonly profileModeService: ProfileModelServiceInterface,
  ) {}

  /**
   * Get current user information with profile data
   */
  @Get()
  @ApiOperation({
    summary: 'Get current user information',
    description: 'Returns authenticated user data along with profile data',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async me(@AuthUser() user: AuthorizedUser): Promise<UserResponseDto> {
    // Get user profile from database
    let profile: ProfileEntityInterface | null;

    try {
      const userProfile = await this.profileModeService.getProfileByUserId(
        user.id,
      );

      profile = userProfile;
    } catch (error) {
      // Profile not found, use empty profile
      profile = null;
    }

    const response = {
      ...user,
      profile: {
        ...profile,
      },
    };

    return response;
  }

  /**
   * Update current user profile data
   */
  @Patch()
  @ApiOperation({
    summary: 'Update user profile data',
    description: 'Creates or updates user profile data',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid profile format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async updateUser(
    @AuthUser() user: AuthorizedUser,
    @Body() updateData: UserUpdateDto,
  ): Promise<UserResponseDto> {
    // Extract profile data from nested profile property
    const profileData = updateData.profile || {};
    // Update profile data
    const profile = await this.profileModeService.createOrUpdate(
      user.id,
      profileData,
    );

    return {
      // Auth provider data
      ...user,
      // Updated profile data (spread into response)
      profile: {
        ...profile,
      },
    };
  }
}
