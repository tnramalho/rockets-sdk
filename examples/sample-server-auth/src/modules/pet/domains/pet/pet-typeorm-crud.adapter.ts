import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { PetEntity } from './pet.entity';

@Injectable()
export class PetTypeOrmCrudAdapter extends TypeOrmCrudAdapter<PetEntity> {
  constructor(
    @InjectRepository(PetEntity)
    petRepository: Repository<PetEntity>,
  ) {
    super(petRepository);
  }
}

