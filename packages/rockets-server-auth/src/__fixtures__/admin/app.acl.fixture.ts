import { AccessControl } from 'accesscontrol';

/**
 * Application roles enum for fixtures
 */
export enum AppRoleFixture {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

/**
 * Application resources enum for fixtures
 */
export enum AppResourceFixture {
  User = 'user',
  Role = 'role',
}

const allResources = Object.values(AppResourceFixture);

/**
 * Access Control Rules for fixtures
 */
export const acRulesFixture: AccessControl = new AccessControl();

// Admin role has full access to all resources
acRulesFixture
  .grant([AppRoleFixture.Admin])
  .resource(allResources)
  .create()
  .read()
  .update()
  .delete();

// Manager role can create, read, and update but CANNOT delete
acRulesFixture
  .grant([AppRoleFixture.Manager])
  .resource(allResources)
  .create()
  .read()
  .update();

// User role - can only access their own resources
acRulesFixture
  .grant([AppRoleFixture.User])
  .resource(allResources)
  .createOwn()
  .readOwn()
  .updateOwn()
  .deleteOwn();
