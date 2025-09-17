import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import {
  RocketsServerModule,
  RocketsServerOptionsInterface,
} from '@bitwild/rockets-server';
import { DocumentBuilder } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';
import { PetEntity } from './entities/pet.entity';
import { ProfileCreateDto, ProfileUpdateDto } from './dto/profile.dto';
import { MockAuthProvider } from './providers/mock-auth.provider';
import { PetsController } from './controllers/pets.controller';
import { PetModule } from './modules/pet/pet.module';

const options: RocketsServerOptionsInterface = {
  settings: {},
  authProvider: new MockAuthProvider() as any,
  profile: {
    createDto: ProfileCreateDto,
    updateDto: ProfileUpdateDto,
  },
};

@Module({
  imports: [
    // TypeORM configuration with SQLite in-memory
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [ProfileEntity, PetEntity],
      synchronize: true,
      dropSchema: true,
    }),
    // Import Pet module for proper dependency injection
    PetModule,
    TypeOrmExtModule.forFeature({
      profile: { entity: ProfileEntity },
    }),
    RocketsServerModule.forRoot(options),
  ],
  controllers: [PetsController],
  providers: [
    MockAuthProvider,
  ],
})
export class AppModule {}


