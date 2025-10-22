import {
  AuthLocalGuard,
  AuthLocalIssueTokenService,
} from '@concepta/nestjs-auth-local';
import {
  AuthPublic,
  AuthUser,
  IssueTokenServiceInterface,
} from '@concepta/nestjs-authentication';
import { Controller, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RocketsAuthJwtResponseDto } from '../dto/rockets-auth-jwt-response.dto';
import { RocketsAuthLoginDto } from '../dto/rockets-auth-login.dto';
import { RocketsAuthAuthenticationResponseInterface } from '../../../interfaces/common/rockets-auth-authentication-response.interface';
import { RocketsAuthUserInterface } from '../../user/interfaces/rockets-auth-user.interface';

/**
 * Controller for password-based authentication
 * Handles user login with username/email and password
 */
@Controller('token/password')
@UseGuards(AuthLocalGuard)
@AuthPublic()
@ApiTags('Authentication')
export class AuthPasswordController {
  constructor(
    @Inject(AuthLocalIssueTokenService)
    private issueTokenService: IssueTokenServiceInterface,
  ) {}

  @ApiOperation({
    summary: 'Authenticate with username/email and password',
    description:
      'Validates credentials and returns authentication tokens on success',
  })
  @ApiBody({
    type: RocketsAuthLoginDto,
    description: 'User credentials',
    examples: {
      standard: {
        value: {
          username: 'user@example.com',
          password: 'StrongP@ssw0rd',
        },
        summary: 'Standard login request',
      },
    },
  })
  @ApiOkResponse({
    type: RocketsAuthJwtResponseDto,
    description: 'Authentication successful, tokens provided',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or inactive account',
  })
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per 60 seconds
  @Post()
  async login(
    @AuthUser() user: RocketsAuthUserInterface,
  ): Promise<RocketsAuthAuthenticationResponseInterface> {
    return this.issueTokenService.responsePayload(user.id);
  }
}
