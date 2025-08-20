import { Type } from '@nestjs/common';

export interface RocketsServerUserProfileSettingsInterface {
  dto?: {
    createOne?: Type;
    createMany?: Type;
    updateOne?: Type;
    replaceOne?: Type;
  };
}


