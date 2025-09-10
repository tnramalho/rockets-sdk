import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { RocketsServerAuthUserDto } from '@bitwild/rockets-server-auth';

@Exclude()
export class UserDto extends RocketsServerAuthUserDto {
  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'First name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}