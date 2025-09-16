import { DynamicModule, Module } from '@nestjs/common';
import { MeController } from './user.controller';
import { ProfileModule } from '../profile/profile.module';

@Module({})
export class UserModule {
  static register(): DynamicModule {
    return {
      module: UserModule,
      imports: [ProfileModule.register()],
      controllers: [MeController],
      exports: [],
    };
  }
}
