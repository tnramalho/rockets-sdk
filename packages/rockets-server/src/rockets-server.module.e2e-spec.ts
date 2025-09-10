import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { FirebaseAuthProviderFixture } from './__fixtures__/providers/firebase-auth.provider.fixture';
import { ServerAuthProviderFixture } from './__fixtures__/providers/server-auth.provider.fixture';
import { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
import { RocketsServerModule } from './rockets-server.module';

describe('RocketsServerModule (e2e)', () => {
  let app: INestApplication;

  const baseOptions: Pick<RocketsServerOptionsInterface, 'settings' | 'services'> = {
    settings: {},
    services: {
      authProvider: new ServerAuthProviderFixture(),
    },
  };

  afterEach(async () => {
    if (app) await app.close();
  });

  it('GET /user with ServerAuth provider returns authorized user', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RocketsServerModule.forRoot(baseOptions),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(res.body).toMatchObject({ id: expect.any(String) });
  });

  it('GET /user with Firebase provider returns authorized user', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RocketsServerModule.forRoot({
          ...baseOptions,
          services: {
            authProvider: new FirebaseAuthProviderFixture(),
          },
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', 'Bearer firebase-token')
      .expect(200);

    expect(res.body).toMatchObject({ id: 'firebase-user-1' });
  });
});


