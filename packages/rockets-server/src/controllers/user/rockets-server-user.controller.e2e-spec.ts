import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { HttpAdapterHost } from '@nestjs/core';

import { AppModuleAdminFixture } from '../../__fixtures__/admin/app-module-admin.fixture';
import { ExceptionsFilter } from '@concepta/nestjs-common';

describe('RocketsServerUserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModuleAdminFixture],
    }).compile();

    app = moduleFixture.createNestApplication();
    const exceptionsFilter = app.get(HttpAdapterHost);

    app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should define app', async () => {
    expect(app).toBeDefined();
  });

  it('should signup, authenticate, get and update user with profile', async () => {
    const username = 'user1';
    const password = 'Password123!';
    const email = 'user1@example.com';

    await request(app.getHttpServer())
      .post('/signup')
      .send({ username, email, password, active: true })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/token/password')
      .send({ username, password })
      .expect(200);

    const token = loginRes.body.accessToken;
    expect(token).toBeDefined();

    const getRes = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getRes.body).toBeDefined();
    expect(getRes.body.username).toBe(username);
    expect(getRes.body.profile).toBeUndefined();
    const userId = getRes.body.id;

    const patchProfileRes = await request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: userId,
        profile: {
          userId,
          firstName: 'John',
        },
      })
      .expect((res) => {
        // eslint-disable-next-line no-console
        console.log('PATCH /user (profile) response:', res.status, res.body);
      })
      .expect(200);

    expect(patchProfileRes.body.profile).toBeDefined();
    expect(patchProfileRes.body.profile.firstName).toBe('John');

    const getRes2 = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(getRes2.body.profile).toBeDefined();
    expect(getRes2.body.profile.firstName).toBe('John');
  });
});
