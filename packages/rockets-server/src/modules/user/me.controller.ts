import {
  Controller,
  Get,
  Patch,
  Body,
  Inject,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthUser } from '@concepta/nestjs-authentication';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { AuthorizedUser } from '../../interfaces/auth-user.interface';
import {
  UserMetadataEntityInterface,
  UserMetadataModelServiceInterface,
} from '../user-metadata/interfaces/user-metadata.interface';
import { UserUpdateDto, UserResponseDto } from './user.dto';
import { UserMetadataModelService } from '../user-metadata/constants/user-metadata.constants';
import { logAndGetErrorDetails } from '../../utils/error-logging.helper';

/**
 * User Controller
 * Provides endpoints for user userMetadata management
 * Follows SDK patterns for controllers
 */
@ApiTags('user')
@ApiBearerAuth()
@Controller('me')
export class MeController {
  private readonly logger = new Logger(MeController.name);

  constructor(
    @Inject(UserMetadataModelService)
    private readonly userMetadataModelService: UserMetadataModelServiceInterface,
  ) {}

  /**
   * Get current user information with userMetadata data
   */
  @Get()
  @ApiOperation({
    summary: 'Get current user information',
    description: 'Returns authenticated user data along with userMetadata data',
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
    // Get user userMetadata from database
    let userMetadata: UserMetadataEntityInterface | null;

    try {
      const metadata =
        await this.userMetadataModelService.getUserMetadataByUserId(user.id);

      userMetadata = metadata;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        (error instanceof Error && error.message?.includes('not found'))
      ) {
        // Expected: user has no metadata yet
        userMetadata = null;
      } else {
        // Unexpected: database error
        logAndGetErrorDetails(
          error,
          this.logger,
          'Failed to fetch user metadata',
          { userId: user.id, errorId: 'USER_METADATA_FETCH_FAILED' },
        );
        // Either throw or return partial data - decide based on UX requirements
        throw new InternalServerErrorException(
          'Failed to load complete profile',
        );
      }
    }

    const response = {
      ...user,
      userMetadata: userMetadata ? { ...userMetadata } : {},
    };

    return response;
  }

  /**
   * Update current user userMetadata data
   */
  @Patch()
  @ApiOperation({
    summary: 'Update user userMetadata data',
    description: 'Creates or updates user userMetadata data',
  })
  @ApiResponse({
    status: 200,
    description: 'User userMetadata updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid userMetadata format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async updateUser(
    @AuthUser() user: AuthorizedUser,
    @Body() updateData: UserUpdateDto,
  ): Promise<UserResponseDto> {
    // Extract userMetadata data from nested userMetadata property
    const userMetadataData = updateData.userMetadata || {};
    // Update userMetadata data
    const userMetadata = await this.userMetadataModelService.createOrUpdate(
      user.id,
      userMetadataData,
    );

    return {
      // Auth provider data
      ...user,
      // Updated userMetadata data (spread into response)
      userMetadata: {
        ...userMetadata,
      },
    };
  }
}
