import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { HttpAdapterHost } from '@nestjs/core';

import { AppModuleAdminFixture } from '../../../__fixtures__/admin/app-module-admin.fixture';
import { ExceptionsFilter, RoleEntityInterface } from '@concepta/nestjs-common';
import { RoleModelService, RoleService } from '@concepta/nestjs-role';

describe('RocketsAuthAdminModule (e2e)', () => {
  let app: INestApplication;
  let roleModelService: RoleModelService;
  let roleService: RoleService;
  let adminRole: RoleEntityInterface;

  beforeAll(async () => {
    process.env.ADMIN_ROLE_NAME = 'admin';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModuleAdminFixture],
    }).compile();

    app = moduleFixture.createNestApplication();
    const exceptionsFilter = app.get(HttpAdapterHost);

    roleModelService = app.get(RoleModelService);
    roleService = app.get(RoleService);
    app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    adminRole = await roleModelService.create({
      name: 'admin',
      description: 'admin role',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should define app', async () => {
    expect(app).toBeDefined();
  });

  it('should signup, authenticate and access admin endpoints', async () => {
    const username = 'adminuser';
    const password = 'Password123!';
    const email = 'adminuser@example.com';

    await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer wrong_token`)
      .expect(401);

    const signupRes = await request(app.getHttpServer())
      .post('/signup')
      .send({ username, email, password, active: true })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/token/password')
      .send({ username, password })
      .expect(200);

    const token = loginRes.body.accessToken;
    expect(token).toBeDefined();

    const userId = signupRes.body.id;
    await roleService.assignRole({
      assignment: 'user',
      role: { id: adminRole.id },
      assignee: { id: userId },
    });

    // Verify the role assignment was successful
    const hasAdminRole = await roleService.isAssignedRole({
      assignment: 'user',
      assignee: { id: userId },
      role: { id: adminRole.id },
    });
    expect(hasAdminRole).toBe(true);

    // Re-login to get a fresh access token after role assignment
    const loginRes2 = await request(app.getHttpServer())
      .post('/token/password')
      .send({ username, password })
      .expect(200);
    const adminToken = loginRes2.body.accessToken;

    const listRes = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(listRes.body).toBeDefined();
  });
});
