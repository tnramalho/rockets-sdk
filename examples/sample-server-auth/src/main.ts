import 'reflect-metadata';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExceptionsFilter } from '@bitwild/rockets-server';
import { SwaggerUiService } from '@concepta/nestjs-swagger-ui';
import { UserModelService } from '@concepta/nestjs-user';
import { RoleModelService, RoleService } from '@concepta/nestjs-role';
import { PasswordCreationService } from '@concepta/nestjs-password';

async function ensureInitialAdmin(app: INestApplication) {
  const userModelService = app.get(UserModelService);
  const roleModelService = app.get(RoleModelService);
  const roleService = app.get(RoleService);
  const passwordCreationService = app.get(PasswordCreationService);

  // test user
  const adminEmail = process.env.ADMIN_EMAIL || 'user@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'StrongP@ssw0rd';
  const adminRoleName = 'admin';

  // Ensure role exists
  let adminRole = (
    await roleModelService.find({ where: { name: adminRoleName } })
  )?.[0];
  if (!adminRole) {
    adminRole = await roleModelService.create({
      name: adminRoleName,
      description: 'Administrator role',
    });
  }

  // Ensure user exists
  let adminUser = (
    await userModelService.find({
      where: [{ username: adminEmail }, { email: adminEmail }],
    })
  )?.[0];
  if (!adminUser) {
    const hashed = await passwordCreationService.create(adminPassword);
    adminUser = await userModelService.create({
      username: adminEmail,
      email: adminEmail,
      active: true,
      ...hashed,
    });
  }

  // Ensure role is assigned to user
  const assignedRoles = await roleService.getAssignedRoles({
    assignment: 'user',
    assignee: { id: adminUser.id },
  });
  const isAssigned = assignedRoles?.some(
    (r: { id: string }) => r.id === adminRole.id,
  );
  if (!isAssigned) {
    await roleService.assignRole({
      assignment: 'user',
      assignee: { id: adminUser.id },
      role: { id: adminRole.id },
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  // Get the swagger ui service, and set it up
  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService.builder().addBearerAuth();
  swaggerUiService.setup(app);

  const exceptionsFilter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));

  await app.listen(3000);

  try {
    await ensureInitialAdmin(app);
    // eslint-disable-next-line no-console
    console.log('Ensured initial admin user and role');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Initial admin bootstrap failed:', err);
  }

  // eslint-disable-next-line no-console
  console.log('Sample server listening on http://localhost:3000');
}

bootstrap();


