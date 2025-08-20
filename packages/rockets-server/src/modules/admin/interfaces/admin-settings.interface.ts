import { Type } from '@nestjs/common';

export interface AdminSettingsInterface {
  dto?: {
    createOne?: Type;
    createMany?: Type;
    updateOne?: Type;
    replaceOne?: Type;
  };
}


