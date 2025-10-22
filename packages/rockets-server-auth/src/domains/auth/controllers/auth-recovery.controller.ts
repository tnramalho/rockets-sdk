import {
  AuthRecoveryService,
  AuthRecoveryServiceInterface,
} from '@concepta/nestjs-auth-recovery';
import { AuthRecoveryOtpInvalidException } from '@concepta/nestjs-auth-verify';
import { AuthPublic } from '@concepta/nestjs-authentication';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RocketsAuthRecoverLoginDto } from '../dto/rockets-auth-recover-login.dto';
import { RocketsAuthRecoverPasswordDto } from '../dto/rockets-auth-recover-password.dto';
import { RocketsAuthUpdatePasswordDto } from '../dto/rockets-auth-update-password.dto';
import { logAndGetErrorDetails } from '../../../shared/utils/error-logging.helper';

/**
 * Controller for account recovery operations
 * Handles login/username recovery, password reset, and passcode validation
 */
@Controller('recovery')
@AuthPublic()
@ApiTags('Authentication')
export class RocketsAuthRecoveryController {
  private readonly logger = new Logger(RocketsAuthRecoveryController.name);

  constructor(
    @Inject(AuthRecoveryService)
    private readonly authRecoveryService: AuthRecoveryServiceInterface,
  ) {}

  @ApiOperation({
    summary: 'Recover username',
    description:
      'Sends an email with the username associated with the provided email address',
  })
  @ApiBody({
    type: RocketsAuthRecoverLoginDto,
    description: 'Email address for username recovery',
    examples: {
      standard: {
        value: {
          email: 'user@example.com',
        },
        summary: 'Standard username recovery request',
      },
    },
  })
  @ApiOkResponse({
    description:
      'Recovery email sent successfully (returns regardless of whether email exists)',
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per 60 seconds
  @Post('/login')
  async recoverLogin(
    @Body() recoverLoginDto: RocketsAuthRecoverLoginDto,
  ): Promise<void> {
    try {
      await this.authRecoveryService.recoverLogin(recoverLoginDto.email);
      this.logger.log('Login recovery initiated'); // Don't log email
    } catch (error) {
      logAndGetErrorDetails(error, this.logger, 'Login recovery failed', {
        errorId: 'RECOVERY_LOGIN_FAILED',
      });
      // Don't re-throw - return void for security (timing attack prevention)
    }
  }

  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Sends an email with a password reset link to the provided email address',
  })
  @ApiBody({
    type: RocketsAuthRecoverPasswordDto,
    description: 'Email address for password reset',
    examples: {
      standard: {
        value: {
          email: 'user@example.com',
        },
        summary: 'Standard password reset request',
      },
    },
  })
  @ApiOkResponse({
    description:
      'Recovery email sent successfully (returns regardless of whether email exists)',
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per 60 seconds
  @Post('/password')
  async recoverPassword(
    @Body() recoverPasswordDto: RocketsAuthRecoverPasswordDto,
  ): Promise<void> {
    try {
      await this.authRecoveryService.recoverPassword(recoverPasswordDto.email);
      this.logger.log('Password recovery initiated'); // Don't log email
    } catch (error) {
      logAndGetErrorDetails(error, this.logger, 'Password recovery failed', {
        errorId: 'RECOVERY_PASSWORD_FAILED',
      });
      // Don't re-throw - return void for security (timing attack prevention)
    }
  }

  @ApiOperation({
    summary: 'Validate recovery passcode',
    description: 'Checks if the provided passcode is valid and not expired',
  })
  @ApiParam({
    name: 'passcode',
    description: 'Recovery passcode to validate',
    example: 'abc123def456',
  })
  @ApiOkResponse({
    description: 'Passcode is valid',
  })
  @ApiNotFoundResponse({
    description: 'Passcode is invalid or expired',
  })
  @Get('/passcode/:passcode')
  async validatePasscode(@Param('passcode') passcode: string): Promise<void> {
    const otp = await this.authRecoveryService.validatePasscode(passcode);

    if (!otp) {
      throw new AuthRecoveryOtpInvalidException();
    }
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Updates the user password using a valid recovery passcode',
  })
  @ApiBody({
    type: RocketsAuthUpdatePasswordDto,
    description: 'Passcode and new password information',
    examples: {
      standard: {
        value: {
          passcode: 'abc123def456',
          newPassword: 'NewSecureP@ssw0rd',
        },
        summary: 'Standard password reset',
      },
    },
  })
  @ApiOkResponse({
    description: 'Password updated successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid passcode, password requirements not met, or passcode expired',
  })
  @Patch('/password')
  async updatePassword(
    @Body() updatePasswordDto: RocketsAuthUpdatePasswordDto,
  ): Promise<void> {
    const { passcode, newPassword } = updatePasswordDto;

    const user = await this.authRecoveryService.updatePassword(
      passcode,
      newPassword,
    );

    if (!user) {
      // the client should have checked using validate passcode first
      throw new AuthRecoveryOtpInvalidException();
    }
  }
}
