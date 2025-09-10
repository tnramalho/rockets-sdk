import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from '@concepta/nestjs-auth-jwt';
import { AuthUser } from '@concepta/nestjs-authentication';
import type { AuthorizedUser } from '../interfaces/auth-user.interface';

@Controller('me')
@UseGuards(AuthJwtGuard)
export class MeController {
  @Get()
  me(@AuthUser() user: AuthorizedUser) {
    //TODO: return rockets user
    // get with metadata
    // get profile by uId
    const metadata = {};
    return {
      // not in our database
      ...user,
      // in our database
      metadata
    };
  }
}


