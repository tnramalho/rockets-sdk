import { UserModelService } from '@concepta/nestjs-user';
import { AuthUser } from '@concepta/nestjs-authentication';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { RocketsServerUserUpdateDto } from '../../dto/user/rockets-server-user-update.dto';
import { RocketsServerUserDto } from '../../dto/user/rockets-server-user.dto';
import { RocketsServerUserEntityInterface } from '../../interfaces/user/rockets-server-user-entity.interface';
import { AuthJwtGuard } from '@concepta/nestjs-auth-jwt';

import { RocketsServerUserProfileModelServiceInterface } from '@user-profile';
import { plainToInstance } from 'class-transformer';
import { RocketsServerUserProfileModelService } from '../../rockets-server.constants';


/**
 * Controller for managing user profile operations
 */
@Controller('user')
@UseGuards(AuthJwtGuard)
@ApiTags('user')
@ApiBearerAuth()
export class RocketsServerUserController {
  constructor(
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
    @Inject(RocketsServerUserProfileModelService)
    private readonly userProfileModelService: RocketsServerUserProfileModelServiceInterface,
  ) {}

  @ApiOperation({
    summary: 'Get a user by ID',
    description:
      "Retrieves the currently authenticated user's profile information",
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: RocketsServerUserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  @Get('')
  async findById(
    @AuthUser('id') id: string,
  ): Promise<RocketsServerUserEntityInterface | null> {
    const user = await this.userModelService.byId(id);
    if (!user) return null;
    const profile =  await this.userProfileModelService.byUserId(id);
    return { ...user, profile: profile || undefined } as RocketsServerUserEntityInterface;
  }

  @ApiOperation({
    summary: 'Update a user',
    description:
      "Updates the currently authenticated user's profile information",
  })
  @ApiBody({
    type: RocketsServerUserUpdateDto,
    description: 'User profile information to update',
    examples: {
      user: {
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        summary: 'Standard user update',
      },
    },
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: RocketsServerUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  @Patch('')
  async update(
    @AuthUser('id') id: string,
    @Body() userUpdateDto: RocketsServerUserUpdateDto,
  ): Promise<RocketsServerUserDto> {
    const { profile, id: _ignoredId, ...userFields } = userUpdateDto as any;
    
    // update user only if there are user fields to update
    let updatedUser: RocketsServerUserEntityInterface;
    if (userFields && Object.keys(userFields).length > 0) {
      updatedUser = await this.userModelService.update({ ...userFields, id });
    } else {
      const existing = await this.userModelService.byId(id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updatedUser = existing! as RocketsServerUserEntityInterface;
    }

    // update or create profile
    if (profile) {
      const existingProfile = await this.userProfileModelService.byUserId(id);
      if (existingProfile) {
        await this.userProfileModelService.update({ ...existingProfile, ...profile });
      } else {
        await this.userProfileModelService.create({ ...profile, userId: id } as any);
      }
    }

    const updatedProfile = await this.userProfileModelService.byUserId(id);

    const response = {
      ...updatedUser,
      profile: updatedProfile || undefined
    };

    return  plainToInstance(RocketsServerUserDto, response);
  }
}
