import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { HttpAdapterHost } from '@nestjs/core';

import { AppModuleAdminRelationsFixture } from '../../../__fixtures__/admin/app-module-admin-relations.fixture';
import { ExceptionsFilter, RoleEntityInterface } from '@concepta/nestjs-common';
import { RoleModelService, RoleService } from '@concepta/nestjs-role';

describe('AdminUserRolesController (e2e)', () => {
  let app: INestApplication;
  let roleModelService: RoleModelService;
  let roleService: RoleService;
  let adminRole: RoleEntityInterface;
  let adminToken: string;
  let adminUserId: string;
  let testUserId: string;
  let testRole: RoleEntityInterface;

  beforeAll(async () => {
    process.env.ADMIN_ROLE_NAME = 'admin';
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModuleAdminRelationsFixture],
    }).compile();

    app = moduleFixture.createNestApplication();
    const exceptionsFilter = app.get(HttpAdapterHost);
    roleModelService = app.get(RoleModelService);
    roleService = app.get(RoleService);
    app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create admin role
    adminRole = await roleModelService.create({
      name: 'admin',
      description: 'admin role',
    });

    // Create admin user
    const adminSignupRes = await request(app.getHttpServer())
      .post('/signup')
      .send({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!',
        active: true,
        userMetadata: { firstName: 'Admin', lastName: 'User' },
      })
      .expect(201);

    adminUserId = adminSignupRes.body.id;

    // Assign admin role to admin user
    await roleService.assignRole({
      assignment: 'user',
      role: { id: adminRole.id },
      assignee: { id: adminUserId },
    });

    // Login as admin to get token
    const loginRes = await request(app.getHttpServer())
      .post('/token/password')
      .send({
        username: 'admin',
        password: 'Admin123!',
      })
      .expect(200);

    adminToken = loginRes.body.accessToken;

    // Create a test user
    const testSignupRes = await request(app.getHttpServer())
      .post('/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test123!',
        active: true,
        userMetadata: { firstName: 'Test', lastName: 'User' },
      })
      .expect(201);

    testUserId = testSignupRes.body.id;

    // Create a test role
    testRole = await roleModelService.create({
      name: 'editor',
      description: 'Editor role',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /admin/users/:userId/roles', () => {
    it('should return empty array when user has no roles', async () => {
      const response = await request(app.getHttpServer())
        .get(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 when no token provided', async () => {
      await request(app.getHttpServer())
        .get(`/admin/users/${testUserId}/roles`)
        .expect(401);
    });

    it('should return 403 when non-admin user tries to access', async () => {
      // Login as non-admin user
      const loginRes = await request(app.getHttpServer())
        .post('/token/password')
        .send({
          username: 'testuser',
          password: 'Test123!',
        })
        .expect(200);

      const nonAdminToken = loginRes.body.accessToken;

      await request(app.getHttpServer())
        .get(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .expect(403);
    });
  });

  describe('POST /admin/users/:userId/roles', () => {
    it('should assign role to user successfully', async () => {
      await request(app.getHttpServer())
        .post(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: testRole.id })
        .expect(201);

      // Verify the role was assigned
      const hasRole = await roleService.isAssignedRole({
        assignment: 'user',
        assignee: { id: testUserId },
        role: { id: testRole.id },
      });

      expect(hasRole).toBe(true);
    });

    it('should return assigned roles after assignment', async () => {
      const response = await request(app.getHttpServer())
        .get(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const assignedRole = response.body.find(
        (r: RoleEntityInterface) => r.id === testRole.id,
      );
      expect(assignedRole).toBeDefined();
      expect(assignedRole.id).toBe(testRole.id);
      // Note: getAssignedRoles may return partial role data
      if (assignedRole.name) {
        expect(assignedRole.name).toBe('editor');
      }
    });

    it('should return 400 when roleId is missing', async () => {
      await request(app.getHttpServer())
        .post(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });

    it('should return 400 when roleId is invalid', async () => {
      await request(app.getHttpServer())
        .post(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: 123 }) // Should be string
        .expect(400);
    });

    it('should return 401 when no token provided', async () => {
      await request(app.getHttpServer())
        .post(`/admin/users/${testUserId}/roles`)
        .send({ roleId: testRole.id })
        .expect(401);
    });

    it('should return 403 when non-admin user tries to assign role', async () => {
      // Login as non-admin user
      const loginRes = await request(app.getHttpServer())
        .post('/token/password')
        .send({
          username: 'testuser',
          password: 'Test123!',
        })
        .expect(200);

      const nonAdminToken = loginRes.body.accessToken;

      await request(app.getHttpServer())
        .post(`/admin/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({ roleId: testRole.id })
        .expect(403);
    });
  });

  describe('Complete flow: Create role and assign to new user', () => {
    it('should create new role, create new user, and assign role successfully', async () => {
      // 1. Create a new role
      const newRole = await roleModelService.create({
        name: 'moderator',
        description: 'Moderator role',
      });

      expect(newRole).toBeDefined();
      expect(newRole.id).toBeDefined();
      expect(newRole.name).toBe('moderator');

      // 2. Create a new user
      const newUserRes = await request(app.getHttpServer())
        .post('/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'NewUser123!',
          active: true,
          userMetadata: { firstName: 'New', lastName: 'User' },
        })
        .expect(201);

      const newUserId = newUserRes.body.id;
      expect(newUserId).toBeDefined();

      // 3. Verify user has no roles initially
      const rolesBeforeRes = await request(app.getHttpServer())
        .get(`/admin/users/${newUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(rolesBeforeRes.body).toBeDefined();
      expect(Array.isArray(rolesBeforeRes.body)).toBe(true);
      expect(rolesBeforeRes.body.length).toBe(0);

      // 4. Assign the new role to the new user
      await request(app.getHttpServer())
        .post(`/admin/users/${newUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: newRole.id })
        .expect(201);

      // 5. Verify the role was assigned
      const rolesAfterRes = await request(app.getHttpServer())
        .get(`/admin/users/${newUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(rolesAfterRes.body).toBeDefined();
      expect(Array.isArray(rolesAfterRes.body)).toBe(true);
      expect(rolesAfterRes.body.length).toBe(1);
      expect(rolesAfterRes.body[0].id).toBe(newRole.id);
      // Note: getAssignedRoles may return partial role data
      if (rolesAfterRes.body[0].name) {
        expect(rolesAfterRes.body[0].name).toBe('moderator');
      }

      // 6. Verify using RoleService
      const hasRole = await roleService.isAssignedRole({
        assignment: 'user',
        assignee: { id: newUserId },
        role: { id: newRole.id },
      });

      expect(hasRole).toBe(true);
    });

    it('should assign multiple roles to a single user', async () => {
      // Create another role
      const secondRole = await roleModelService.create({
        name: 'viewer',
        description: 'Viewer role',
      });

      // Create a new user
      const userRes = await request(app.getHttpServer())
        .post('/signup')
        .send({
          username: 'multiuser',
          email: 'multiuser@example.com',
          password: 'Multi123!',
          active: true,
          userMetadata: { firstName: 'Multi', lastName: 'User' },
        })
        .expect(201);

      const userId = userRes.body.id;

      // Assign first role
      await request(app.getHttpServer())
        .post(`/admin/users/${userId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: testRole.id })
        .expect(201);

      // Assign second role
      await request(app.getHttpServer())
        .post(`/admin/users/${userId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleId: secondRole.id })
        .expect(201);

      // Verify both roles are assigned
      const rolesRes = await request(app.getHttpServer())
        .get(`/admin/users/${userId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(rolesRes.body).toBeDefined();
      expect(Array.isArray(rolesRes.body)).toBe(true);
      expect(rolesRes.body.length).toBe(2);

      const roleIds = rolesRes.body.map((r: RoleEntityInterface) => r.id);
      expect(roleIds).toContain(testRole.id);
      expect(roleIds).toContain(secondRole.id);
    });
  });
});
