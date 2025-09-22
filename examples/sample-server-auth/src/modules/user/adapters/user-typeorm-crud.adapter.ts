import { Injectable } from '@nestjs/common';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RocketsServerAuthUserEntityInterface } from '@bitwild/rockets-server-auth';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserTypeOrmCrudAdapter extends TypeOrmCrudAdapter<RocketsServerAuthUserEntityInterface> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<RocketsServerAuthUserEntityInterface>,
  ) {
    super(repository);
  }
}