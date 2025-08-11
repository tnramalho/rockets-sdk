// Export the main module
export { RocketsServerModule } from './rockets-server.module';

// Export constants
export { ROCKETS_SERVER_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from './rockets-server.constants';

// Export configuration
export { authenticationOptionsDefaultConfig } from './config/rockets-server-options-default.config';

// Export controllers
export { AuthOAuthController } from './controllers/oauth/auth-oauth.controller';

// Export admin adapter
export { AdminUserTypeOrmCrudAdapter } from './controllers/admin/admin-user-crud.adapter';

// Export admin CRUD builder
export { AdminUserCrudBuilder } from './utils/admin-user.crud-builder';

// Export admin constants
export { ADMIN_USER_CRUD_SERVICE_TOKEN } from './rockets-server.constants';

// Export admin guard
export { AdminGuard } from './guards/admin.guard';

// Export admin fixture (for testing and examples)
export { AppModuleAdminUserFixture } from './__fixtures__/admin/app-module-admin-user.fixture';

// Export admin dynamic module
export { RocketsServerAdminModule } from './modules/admin/rockets-server-admin.module';

// Export admin configuration types
export type { RocketsServerOptionsInterface } from './interfaces/rockets-server-options.interface';
export type { RocketsServerOptionsExtrasInterface } from './interfaces/rockets-server-options-extras.interface';

// Export Swagger generator
export { generateSwaggerJson } from './generate-swagger';
// Export DTOs
export { RocketsServerJwtResponseDto } from './dto/auth/rockets-server-jwt-response.dto';
export { RocketsServerLoginDto } from './dto/auth/rockets-server-login.dto';
