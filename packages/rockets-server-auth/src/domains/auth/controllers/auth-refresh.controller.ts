import {
  AuthRefreshGuard,
  AuthRefreshIssueTokenService,
} from '@concepta/nestjs-auth-refresh';
import {
  AuthPublic,
  AuthUser,
  IssueTokenServiceInterface,
} from '@concepta/nestjs-authentication';
import { Controller, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RocketsAuthJwtResponseDto } from '../dto/rockets-auth-jwt-response.dto';
import { RocketsAuthRefreshDto } from '../dto/rockets-auth-refresh.dto';
import { RocketsAuthAuthenticationResponseInterface } from '../../../interfaces/common/rockets-auth-authentication-response.interface';
import { RocketsAuthUserInterface } from '../../user/interfaces/rockets-auth-user.interface';

/**
 * Controller for JWT refresh token operations
 * Allows users to obtain a new access token using their refresh token
 */
@Controller('token/refresh')
@UseGuards(AuthRefreshGuard)
@AuthPublic()
@ApiTags('Authentication')
@ApiSecurity('bearer')
export class AuthTokenRefreshController {
  constructor(
    @Inject(AuthRefreshIssueTokenService)
    private issueTokenService: IssueTokenServiceInterface,
  ) {}

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token using a valid refresh token',
  })
  @ApiBody({
    type: RocketsAuthRefreshDto,
    description: 'Refresh token information',
    examples: {
      standard: {
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        summary: 'Standard refresh token request',
      },
    },
  })
  @ApiOkResponse({
    type: RocketsAuthJwtResponseDto,
    description: 'New access and refresh tokens',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  @Post()
  @HttpCode(200)
  async refresh(
    @AuthUser() user: RocketsAuthUserInterface,
  ): Promise<RocketsAuthAuthenticationResponseInterface> {
    return this.issueTokenService.responsePayload(user.id);
  }
}
