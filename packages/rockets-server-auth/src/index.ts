// Export the main module
export { RocketsAuthModule } from './rockets-auth.module';

// Export domain APIs
export * from './domains/auth';
export * from './domains/user';
export * from './domains/oauth';
export * from './domains/otp';

// Export shared resources
export * from './shared';

// Export Swagger generator
export { generateSwaggerJson } from './generate-swagger';

// Re-export commonly used interfaces and types for backward compatibility
export type { RocketsAuthOptionsInterface } from './shared/interfaces/rockets-auth-options.interface';
export type { RocketsAuthOptionsExtrasInterface } from './shared/interfaces/rockets-auth-options-extras.interface';
export type { RocketsAuthUserInterface } from './domains/user/interfaces/rockets-auth-user.interface';
export type { RocketsAuthUserCreatableInterface } from './domains/user/interfaces/rockets-auth-user-creatable.interface';
export type { RocketsAuthUserUpdatableInterface } from './domains/user/interfaces/rockets-auth-user-updatable.interface';
export type { RocketsAuthUserEntityInterface } from './domains/user/interfaces/rockets-auth-user-entity.interface';

// Export JWT auth provider
export { RocketsJwtAuthProvider } from './provider/rockets-jwt-auth.provider';

// Export commonly used constants for backward compatibility
export { ROCKETS_AUTH_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN as ROCKETS_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN } from './shared/constants/rockets-auth.constants';
export { ADMIN_USER_CRUD_SERVICE_TOKEN } from './shared/constants/rockets-auth.constants';
