# Rockets SDK Documentation

## Project

[![NPM Latest](https://img.shields.io/npm/v/@bitwild/rockets-server)](https://www.npmjs.com/package/@bitwild/rockets-server)
[![NPM Downloads](https://img.shields.io/npm/dw/@bitwild/rockets-server)](https://www.npmjs.com/package/@bitwild/rockets-server)
[![GH Last Commit](https://img.shields.io/github/last-commit/btwld/rockets?logo=github)](https://github.com/btwld/rockets)
[![GH Contrib](https://img.shields.io/github/contributors/btwld/rockets?logo=github)](https://github.com/btwld/rockets/graphs/contributors)

## Table of Contents

- [Introduction](#introduction)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Installation](#installation)
- [Tutorial](#tutorial)
  - [Quick Start](#quick-start)
  - [Basic Setup](#basic-setup)
  - [Your First API](#your-first-api)
  - [Testing the Setup](#testing-the-setup)
- [How-to Guides](#how-to-guides)
  - [Configuration Overview](#configuration-overview)
  - [settings](#settings)
  - [authentication](#authentication)
  - [jwt](#jwt)
  - [authJwt](#authjwt)
  - [authLocal](#authlocal)
  - [authRecovery](#authrecovery)
  - [refresh](#refresh)
  - [authVerify](#authverify)
  - [user](#user)
  - [password](#password)
  - [otp](#otp)
  - [email](#email)
  - [services](#services)
- [Explanation](#explanation)
  - [Architecture Overview](#architecture-overview)
  - [Design Decisions](#design-decisions)
  - [Core Concepts](#core-concepts)

---

## Introduction

### Overview

The Rockets SDK is a comprehensive, enterprise-grade toolkit for building
secure and scalable NestJS applications. It provides a unified solution that
combines authentication, user management, OTP verification, email
notifications, and API documentation into a single, cohesive package.

Built with TypeScript and following NestJS best practices, the Rockets SDK
eliminates the complexity of setting up authentication systems while
maintaining flexibility for customization and extension.

### Key Features

- **🔐 Complete Authentication System**: JWT tokens, local authentication,
  refresh tokens, and password recovery
- **👥 User Management**: Full CRUD operations, profile management, and
  password history
- **📱 OTP Support**: One-time password generation and validation for secure
  authentication
- **📧 Email Notifications**: Built-in email service with template support
- **📚 API Documentation**: Automatic Swagger/OpenAPI documentation generation
- **🔧 Highly Configurable**: Extensive configuration options for all modules
- **🏗️ Modular Architecture**: Use only what you need, extend what you want
- **🛡️ Type Safety**: Full TypeScript support with comprehensive interfaces
- **🧪 Testing Support**: Complete testing utilities and fixtures
- **🔌 Adapter Pattern**: Support for multiple database adapters

### Installation

**⚠️ CRITICAL: Alpha Version Issue**:

> **The current alpha version (7.0.0-alpha.4) has a dependency injection
> issue with AuthJwtGuard that prevents the minimal setup from working. This
> is a known issue being investigated.**

**Version Requirements**:

- NestJS: `^10.0.0`
- Node.js: `>=18.0.0`
- TypeScript: `>=4.8.0`

Let's create a new NestJS project:

```bash
npx @nestjs/cli@10 new my-app-with-rockets --package-manager yarn --language TypeScript --strict
```

Install the Rockets SDK and all required dependencies:

```bash
yarn add @bitwild/rockets-server @concepta/nestjs-typeorm-ext \
  @concepta/nestjs-common typeorm @nestjs/typeorm @nestjs/config \
  @nestjs/swagger class-transformer class-validator sqlite3
```

---

## Tutorial

### Quick Start

This tutorial will guide you through setting up a complete authentication
system with the Rockets SDK in just a few steps. We'll use SQLite in-memory
database for instant setup without any configuration.

### Basic Setup

#### Step 1: Create Your Entities

First, create the required database entities by extending the base entities
provided by the SDK:

```typescript
// entities/user.entity.ts
import { Entity, OneToMany } from 'typeorm';
import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserOtpEntity } from './user-otp.entity';

@Entity()
export class UserEntity extends UserSqliteEntity {
  @OneToMany(() => UserOtpEntity, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntity[];
}
```

```typescript
// entities/user-otp.entity.ts
import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/nestjs-common';
import { OtpSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';

@Entity()
export class UserOtpEntity extends OtpSqliteEntity {
  @ManyToOne(() => UserEntity, (user) => user.userOtps)
  assignee!: ReferenceIdInterface;
}
```

#### Step 2: Set Up Environment Variables (Production Only)

For production, create a `.env` file with JWT secrets:

```env
# Required for production
JWT_MODULE_ACCESS_SECRET=your-super-secret-jwt-access-key-here
# Optional - defaults to access secret if not provided
JWT_MODULE_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
NODE_ENV=development
```

**Note**: In development, JWT secrets are auto-generated if not provided.

#### Step 3: Configure Your Module

Create your main application module with the minimal Rockets SDK setup:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RocketsServerModule } from '@bitwild/rockets-server';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './entities/user.entity';
import { UserOtpEntity } from './entities/user-otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database configuration - SQLite in-memory for easy testing
    TypeOrmExtModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // In-memory database - no files created
      synchronize: true,    // Auto-create tables (dev only)
      autoLoadEntities: true,
      logging: false,       // Set to true to see SQL queries
      entities: [UserEntity, UserOtpEntity],
    }),
    
    // Rockets SDK configuration - minimal setup
    RocketsServerModule.forRootAsync({
      imports: [ConfigModule],
      // REQUIRED: User entity imports
      user: {
        imports: [
          TypeOrmExtModule.forFeature({
            user: { entity: UserEntity },
          }),
        ],
      },
      
      // REQUIRED: OTP entity imports
      otp: {
        imports: [
          TypeOrmExtModule.forFeature({
            userOtp: { entity: UserOtpEntity },
          }),
        ],
      },
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Required services
        services: {
          mailerService: {
            sendMail: (options: any) => {
              console.log('📧 Email would be sent:', {
                to: options.to,
                subject: options.subject,
                // Don't log the full content in examples
              });
              return Promise.resolve();
            },
          },
        },
        
        // Email and OTP settings
        settings: {
          email: {
            from: 'noreply@yourapp.com',
            baseUrl: 'http://localhost:3000',
            templates: {
              sendOtp: {
                fileName: 'otp.template.hbs',
                subject: 'Your verification code',
              },
            },
          },
          otp: {
            assignment: 'userOtp',
            category: 'auth-login',
            type: 'numeric',
            expiresIn: '10m',
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

#### Step 4: Create Your Main Application

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExceptionsFilter } from '@concepta/nestjs-common';
import { SwaggerUiService } from '@concepta/nestjs-swagger-ui';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  // get the swagger ui service, and set it up
  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService.builder().addBearerAuth();
  swaggerUiService.setup(app);

  const exceptionsFilter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('API Documentation: http://localhost:3000/api');
  console.log('Using SQLite in-memory database (data resets on restart)');
}
bootstrap();
```

### Your First API

With the basic setup complete, your application now provides these endpoints:

#### Authentication Endpoints

- `POST /signup` - Register a new user
- `POST /token/password` - Login with username/password (returns 200 OK with tokens)
- `POST /token/refresh` - Refresh access token
- `POST /recovery/login` - Initiate username recovery
- `POST /recovery/password` - Initiate password reset
- `PATCH /recovery/password` - Reset password with passcode
- `GET /recovery/passcode/:passcode` - Validate recovery passcode

#### User Management Endpoints

- `GET /user` - Get current user profile
- `PATCH /user` - Update current user profile

#### OTP Endpoints

- `POST /otp` - Send OTP to user email (returns 200 OK)
- `PATCH /otp` - Confirm OTP code (returns 200 OK with tokens)

### Testing the Setup

#### 1. Start Your Application

```bash
npm run start:dev
```

#### 2. Register a New User

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "username": "testuser"
  }'
```

Expected response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "testuser",
  "active": true,
  "dateCreated": "2024-01-01T00:00:00.000Z",
  "dateUpdated": "2024-01-01T00:00:00.000Z",
  "dateDeleted": null,
  "version": 1
}
```

#### 3. Login and Get Access Token

```bash
curl -X POST http://localhost:3000/token/password \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

Expected response (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note**: The login endpoint returns a 200 OK status (not 201 Created) as it's retrieving
tokens, not creating a new resource.

**Defaults Working**: All authentication endpoints work out-of-the-box with
sensible defaults.

#### 4. Access Protected Endpoint

```bash
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Expected response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "testuser",
  "active": true,
  "dateCreated": "2024-01-01T00:00:00.000Z",
  "dateUpdated": "2024-01-01T00:00:00.000Z",
  "dateDeleted": null,
  "version": 1
}
```

#### 5. Test OTP Functionality

```bash
# Send OTP (returns 200 OK)
curl -X POST http://localhost:3000/otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'

# Check console for the "email" that would be sent with the OTP code
# Then confirm with the code (replace 123456 with actual code)
# Returns 200 OK with tokens
curl -X PATCH http://localhost:3000/otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "passcode": "123456"
  }'
```

Expected OTP confirm response (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

🎉 **Congratulations!** You now have a fully functional authentication system
with user management, JWT tokens, and API documentation running with minimal configuration.

**💡 Pro Tip**: Since we're using an in-memory database, all data is lost when
you restart the application. This is perfect for testing and development!

### Troubleshooting

#### Common Issues

#### AuthJwtGuard Dependency Error

If you encounter this error:

```text
Nest can't resolve dependencies of the AuthJwtGuard
(AUTHENTICATION_MODULE_SETTINGS_TOKEN, ?). Please make sure that the
argument Reflector at index [1] is available in the AuthJwtModule context.
```

#### Module Resolution Errors

If you're getting dependency resolution errors:

1. **NestJS Version**: Ensure you're using NestJS `^10.0.0`
2. **Alpha Packages**: All `@concepta/*` packages should use the same alpha
   version (e.g., `^7.0.0-alpha.4`)
3. **Clean Installation**: Try deleting `node_modules` and `package-lock.json`,
   then run `yarn install`

#### Module Resolution Errors (TypeScript)

If TypeScript can't find modules like `@concepta/nestjs-typeorm-ext`:

```bash
yarn add @concepta/nestjs-typeorm-ext @concepta/nestjs-common \
  --save
```

All dependencies listed in the installation section are required and must be
installed explicitly.

---

## How-to Guides

This section provides comprehensive guides for every configuration option
available in the `RocketsServerOptionsInterface`. Each guide explains what the
option does, how it connects with core modules, when you should customize it
(since defaults are provided), and includes real-world examples.

### Configuration Overview

The Rockets SDK uses a hierarchical configuration system with the following structure:

```typescript
interface RocketsServerOptionsInterface {
  settings?: RocketsServerSettingsInterface;
  swagger?: SwaggerUiOptionsInterface;
  authentication?: AuthenticationOptionsInterface;
  jwt?: JwtOptions;
  authJwt?: AuthJwtOptionsInterface;
  authLocal?: AuthLocalOptionsInterface;
  authRecovery?: AuthRecoveryOptionsInterface;
  refresh?: AuthRefreshOptions;
  authVerify?: AuthVerifyOptionsInterface;
  user?: UserOptionsInterface;
  password?: PasswordOptionsInterface;
  otp?: OtpOptionsInterface;
  email?: Partial<EmailOptionsInterface>;
  services: {
    userModelService?: RocketsServerUserModelServiceInterface;
    notificationService?: RocketsServerNotificationServiceInterface;
    verifyTokenService?: VerifyTokenService;
    issueTokenService?: IssueTokenServiceInterface;
    validateTokenService?: ValidateTokenServiceInterface;
    validateUserService?: AuthLocalValidateUserServiceInterface;
    userPasswordService?: UserPasswordServiceInterface;
    userPasswordHistoryService?: UserPasswordHistoryServiceInterface;
    userAccessQueryService?: CanAccess;
    mailerService: EmailServiceInterface; // Required
  };
}
```

---

### settings

**What it does**: Global settings that configure the custom OTP and email
services provided by RocketsServer. These settings are used by the custom OTP
controller and notification services, not by the core authentication modules.

**Core services it connects to**: RocketsServerOtpService,
RocketsServerNotificationService

**When to update**: Required when using the custom OTP endpoints
(`POST /otp`, `PATCH /otp`). The defaults use placeholder values that won't
work in real applications.

**Real-world example**: Setting up email configuration for the custom OTP
system:

```typescript
settings: {
  email: {
    from: 'noreply@mycompany.com',
    baseUrl: 'https://app.mycompany.com',
    tokenUrlFormatter: (baseUrl, token) =>
      `${baseUrl}/auth/verify?token=${token}&utm_source=email`,
    templates: {
      sendOtp: {
        fileName: 'custom-otp.template.hbs',
        subject: 'Your {{appName}} verification code - expires in 10 minutes',
      },
    },
  },
  otp: {
    assignment: 'userOtp',
    category: 'auth-login',
    type: 'numeric', // Use 6-digit numeric codes instead of UUIDs
    expiresIn: '10m', // Shorter expiry for security
  },
}
```

---

### authentication

**What it does**: Core authentication module configuration that handles token
verification, validation services and the payload of the token. It provides
three key services:

- **verifyTokenService**: Handles two-step token verification - first
  cryptographically verifying JWT tokens using JwtVerifyTokenService, then
  optionally validating the decoded payload through a validateTokenService.
  Used by authentication guards and protected routes.

- **issueTokenService**: Generates and signs new JWT tokens for authenticated
  users. Creates both access and refresh tokens with user payload data and
  builds complete authentication responses. Used during login, signup, and
  token refresh flows.

- **validateTokenService**: Optional service for custom business logic
  validation beyond basic JWT verification. Can check user existence, token
  blacklists, account status, or any other custom validation rules.

**Core modules it connects to**: AuthenticationModule (the base authentication
  system)

**When to update**: When you need to customize core authentication behavior,
provide custom token services or change how the token payload is structured.
Common scenarios include:

- Implementing custom token verification logic
- Adding business-specific token validation rules
- Modifying token generation and payload structure
- Integrating with external authentication systems

**Real-world example**: Custom authentication configuration:

```typescript
authentication: {
  settings: {
    enableGuards: true, // Default: true
  },
  // Optional: Custom services (defaults are provided)
  issueTokenService: new CustomTokenIssuanceService(),
  verifyTokenService: new CustomTokenVerificationService(),
  validateTokenService: new CustomTokenValidationService(),
}
```

**Note**: All token services have working defaults. Only customize if you need
specific business logic.

---

### jwt

**What it does**: JWT token configuration including secrets, expiration times,
and token services.

**Core modules it connects to**: JwtModule, AuthJwtModule, AuthRefreshModule

**When to update**: Only needed if loading JWT settings from a source other than
environment variables (e.g. config files, external services, etc).

**Environment Variables**: The JWT module automatically uses these environment
variables with sensible defaults:

- `JWT_MODULE_DEFAULT_EXPIRES_IN` (default: `'1h'`)
- `JWT_MODULE_ACCESS_EXPIRES_IN` (default: `'1h'`)
- `JWT_MODULE_REFRESH_EXPIRES_IN` (default: `'99y'`)
- `JWT_MODULE_ACCESS_SECRET` (required in production, auto-generated in
  development, if not provided)
- `JWT_MODULE_REFRESH_SECRET` (defaults to access secret if not provided)

**Default Behavior**:

- **Development**: JWT secrets are auto-generated if not provided
- **Production**: `JWT_MODULE_ACCESS_SECRET` is required (with
  NODE_ENV=production)
- **Token Services**: Default `JwtIssueTokenService` and
  `JwtVerifyTokenService` are provided
- **Multiple Token Types**: Separate access and refresh token handling

**Security Notes**:

- Production requires explicit JWT secrets for security
- Development auto-generates secrets for convenience
- Refresh tokens have longer expiration by default
- All token operations are handled automatically

**Real-world example**: Custom JWT configuration (optional - defaults work
for most cases):

```typescript
jwt: {
  settings: {
    default: {
      signOptions: {
        issuer: 'mycompany.com',
        audience: 'mycompany-api',
      },
    },
    access: {
      signOptions: {
        issuer: 'mycompany.com',
        audience: 'mycompany-api',
      },
    },
    refresh: {
      signOptions: {
        issuer: 'mycompany.com',
        audience: 'mycompany-refresh',
      },
    },
  },
  // Optional: Custom services (defaults are provided)
  jwtIssueTokenService: new CustomJwtIssueService(),
  jwtVerifyTokenService: new CustomJwtVerifyService(),
}
```

**Note**: Environment variables are automatically used for secrets and
expiration times. Only customize `jwt.settings` if you need specific JWT
options like issuer/audience, you can also use the environment variables to
configure the JWT module.

---

### authJwt

**What it does**: JWT-based authentication strategy configuration, including how
tokens are extracted from requests.

**Core modules it connects to**: AuthJwtModule, provides JWT authentication
guards and strategies

**When to update**: When you need custom token extraction logic or want to
modify JWT authentication behavior.

**Real-world example**: Custom token extraction for mobile apps that send tokens
in custom headers:

```typescript
authJwt: {
  settings: {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(), // Standard Bearer token
      ExtractJwt.fromHeader('x-api-token'), // Custom header for mobile
      (request) => {
        // Custom extraction from cookies for web apps
        return request.cookies?.access_token;
      },
    ]),
  },
  // Optional settings (defaults are sensible)
  appGuard: true, // Default: true - set true to apply JWT guard globally
  // Optional services (defaults are provided)
  verifyTokenService: new CustomJwtVerifyService(),
  userModelService: new CustomUserLookupService(),
}
```

**Note**: Default token extraction uses standard Bearer token from
Authorization header. Only customize if you need alternative token sources.

---

### authLocal

**What it does**: Local authentication (username/password) configuration and
validation services.

**Core modules it connects to**: AuthLocalModule, handles login endpoint and
credential validation

**When to update**: When you need custom password validation, user lookup logic,
or want to integrate with external authentication systems.

**Real-world example**: Custom local authentication with email login:

```typescript
authLocal: {
  settings: {
    usernameField: 'email', // Default: 'username'
    passwordField: 'password', // Default: 'password'
  },
  // Optional services (defaults work with TypeORM entities)
  validateUserService: new CustomUserValidationService(),
  userModelService: new CustomUserModelService(),
  issueTokenService: new CustomTokenIssuanceService(),
}
```

**Environment Variables**:

- `AUTH_LOCAL_USERNAME_FIELD` - defaults to `'username'`
- `AUTH_LOCAL_PASSWORD_FIELD` - defaults to `'password'`

**Note**: The default services work automatically with your TypeORM User entity.
Only customize if you need specific validation logic.

---

### authRecovery

**What it does**: Password recovery and account recovery functionality including
email notifications and OTP generation.

**Core modules it connects to**: AuthRecoveryModule, provides password reset
endpoints

**When to update**: When you need custom recovery flows, different notification
methods, or integration with external services.

**Real-world example**: Multi-channel recovery system with SMS and email options:

```typescript
authRecovery: {
  settings: {
    tokenExpiresIn: '1h', // Recovery token expiration
    maxAttempts: 3, // Maximum recovery attempts
  },
  emailService: new CustomEmailService(),
  otpService: new CustomOtpService(),
  userModelService: new CustomUserModelService(),
  userPasswordService: new CustomPasswordService(),
  notificationService: new MultiChannelNotificationService(), // SMS + Email
}
```

---

### refresh

**What it does**: Refresh token configuration for maintaining user sessions
without requiring re-authentication.

**Core modules it connects to**: AuthRefreshModule, provides token refresh
endpoints

**When to update**: When you need custom refresh token behavior, different
expiration strategies, or want to implement token rotation.

**Real-world example**: Secure refresh token rotation for high-security
applications:

```typescript
refresh: {
  settings: {
    jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
    tokenRotation: true, // Issue new refresh token on each use
    revokeOnUse: true, // Revoke old refresh token
  },
  verifyTokenService: new SecureRefreshTokenVerifyService(),
  issueTokenService: new RotatingTokenIssueService(),
  userModelService: new AuditableUserModelService(), // Log refresh attempts
}
```

---

### authVerify

**What it does**: Email verification and account verification functionality.

**Core modules it connects to**: AuthVerifyModule, provides email verification
endpoints

**When to update**: When you need custom verification flows, different
verification methods, or want to integrate with external verification services.

**Real-world example**: Multi-step verification with phone and email:

```typescript
authVerify: {
  settings: {
    verificationRequired: true, // Require verification before login
    verificationExpiresIn: '24h',
  },
  emailService: new CustomEmailService(),
  otpService: new CustomOtpService(),
  userModelService: new CustomUserModelService(),
  notificationService: new MultiStepVerificationService(), // Email + SMS
}
```

---

### user

**What it does**: User management configuration including CRUD operations,
password management, and access control.

**Core modules it connects to**: UserModule, provides user management endpoints

**When to update**: When you need custom user management logic, different access
control, or want to integrate with external user systems.

**Real-world example**: Enterprise user management with role-based access
control:

```typescript
user: {
  imports: [
    TypeOrmExtModule.forFeature({
      user: { entity: UserEntity },
      userProfile: { entity: UserProfileEntity },
      userPasswordHistory: { entity: UserPasswordHistoryEntity },
    }),
  ],
  settings: {
    enableProfiles: true, // Enable user profiles
    enablePasswordHistory: true, // Track password history
  },
  userModelService: new EnterpriseUserModelService(),
  userPasswordService: new SecurePasswordService(),
  userAccessQueryService: new RoleBasedAccessService(),
  userPasswordHistoryService: new PasswordHistoryService(),
}
```

---

### password

**What it does**: Password policy and validation configuration.

**Core modules it connects to**: PasswordModule, provides password validation
across the system

**When to update**: When you need to enforce specific password policies or
integrate with external password validation services.

**Real-world example**: Enterprise password policy with complexity requirements:

```typescript
password: {
  settings: {
    minPasswordStrength: 3, // 0-4 scale (default: 2)
    maxPasswordAttempts: 5, // Default: 3
    requireCurrentToUpdate: true, // Default: false
    passwordHistory: 12, // Remember last 12 passwords
  },
}
```

**Environment Variables**:

- `PASSWORD_MIN_PASSWORD_STRENGTH` - defaults to `4` if production, `0` if
  development (0-4 scale)
- `PASSWORD_MAX_PASSWORD_ATTEMPTS` - defaults to `3`
- `PASSWORD_REQUIRE_CURRENT_TO_UPDATE` - defaults to `false`

**Note**: Password strength is automatically calculated using zxcvbn. History
tracking is optional and requires additional configuration.

---

### otp

**What it does**: One-time password configuration for the OTP system.

**Core modules it connects to**: OtpModule, provides OTP generation and
validation

**When to update**: When you need custom OTP behavior, different OTP types, or
want to integrate with external OTP services.

**Interface**: `OtpSettingsInterface` from `@concepta/nestjs-otp`

```typescript
interface OtpSettingsInterface {
  types: Record<string, OtpTypeServiceInterface>;
  clearOnCreate: boolean;
  keepHistoryDays?: number;
  rateSeconds?: number;
  rateThreshold?: number;
}
```

**Environment Variables**:

- `OTP_CLEAR_ON_CREATE` - defaults to `false`
- `OTP_KEEP_HISTORY_DAYS` - no default (optional)
- `OTP_RATE_SECONDS` - no default (optional)  
- `OTP_RATE_THRESHOLD` - no default (optional)

**Real-world example**: High-security OTP configuration with rate limiting:

```typescript
otp: {
  imports: [
    TypeOrmExtModule.forFeature({
      userOtp: { entity: UserOtpEntity },
    }),
  ],
  settings: {
    types: {
      uuid: {
        generator: () => require('uuid').v4(),
        validator: (value: string, expected: string) => value === expected,
      },
    },
    clearOnCreate: true, // Clear old OTPs when creating new ones
    keepHistoryDays: 30, // Keep OTP history for 30 days
    rateSeconds: 60, // Minimum 60 seconds between OTP requests
    rateThreshold: 5, // Maximum 5 attempts within rate window
  },
}
```

---

### email

**What it does**: Email service configuration for sending notifications and
templates.

**Core modules it connects to**: EmailModule, used by AuthRecoveryModule and
AuthVerifyModule

**When to update**: When you need to use a different email service provider or
customize email sending behavior.

**Interface**: `EmailServiceInterface` from `@concepta/nestjs-email`

**Configuration example**:

```typescript
email: {
  service: new YourCustomEmailService(), // Must implement EmailServiceInterface
  settings: {}, // Settings object is empty
}
```

---

### services

The `services` object contains injectable services that customize core
functionality. Each service has specific responsibilities:

#### services.userModelService

**What it does**: Core user lookup service used across multiple authentication
modules.

**Core modules it connects to**: AuthJwtModule, AuthRefreshModule,
AuthLocalModule, AuthRecoveryModule

**When to update**: When you need to integrate with external user systems or
implement custom user lookup logic.

**Interface**: `UserModelServiceInterface` from `@concepta/nestjs-user`

**Configuration example**:

```typescript
services: {
  userModelService: new YourCustomUserModelService(), // Must implement UserModelServiceInterface
}
```

#### services.notificationService

**What it does**: Handles sending notifications for recovery and verification
processes.

**Core modules it connects to**: AuthRecoveryModule, AuthVerifyModule

**When to update**: When you need custom notification channels (SMS, push
notifications) or integration with external notification services.

**Interface**: `NotificationServiceInterface` from `@concepta/nestjs-authentication`

**Configuration example**:

```typescript
services: {
  notificationService: new YourCustomNotificationService(), // Must implement NotificationServiceInterface
}
```

#### services.verifyTokenService

**What it does**: Verifies JWT tokens for authentication.

**Core modules it connects to**: AuthenticationModule, JwtModule

**When to update**: When you need custom token verification logic or integration
with external token validation services.

**Interface**: `VerifyTokenServiceInterface` from `@concepta/nestjs-authentication`

**Configuration example**:

```typescript
services: {
  verifyTokenService: new YourCustomVerifyTokenService(), // Must implement VerifyTokenServiceInterface
}
```

#### services.issueTokenService

**What it does**: Issues JWT tokens for authenticated users.

**Core modules it connects to**: AuthenticationModule, AuthLocalModule,
AuthRefreshModule

**When to update**: When you need custom token issuance logic or want to include
additional claims.

**Interface**: `IssueTokenServiceInterface` from `@concepta/nestjs-authentication`

**Configuration example**:

```typescript
services: {
  issueTokenService: new YourCustomIssueTokenService(), // Must implement IssueTokenServiceInterface
}
```

#### services.validateTokenService

**What it does**: Validates token structure and claims.

**Core modules it connects to**: AuthenticationModule

**When to update**: When you need custom token validation rules or security
checks.

**Interface**: `ValidateTokenServiceInterface` from `@concepta/nestjs-authentication`

**Configuration example**:

```typescript
services: {
  validateTokenService: new YourCustomValidateTokenService(), // Must implement ValidateTokenServiceInterface
}
```

#### services.validateUserService

**What it does**: Validates user credentials during local authentication.

**Core modules it connects to**: AuthLocalModule

**When to update**: When you need custom credential validation or integration
with external authentication systems.

**Interface**: `ValidateUserServiceInterface` from `@concepta/nestjs-authentication`

**Configuration example**:

```typescript
services: {
  validateUserService: new YourCustomValidateUserService(), // Must implement ValidateUserServiceInterface
}
```

#### services.userPasswordService

**What it does**: Handles password operations including hashing and validation.

**Core modules it connects to**: UserModule, AuthRecoveryModule

**When to update**: When you need custom password hashing algorithms or password
policy enforcement.

**Interface**: `UserPasswordServiceInterface` from `@concepta/nestjs-user`

**Configuration example**:

```typescript
services: {
  userPasswordService: new YourCustomUserPasswordService(), // Must implement UserPasswordServiceInterface
}
```

#### services.userPasswordHistoryService

**What it does**: Manages password history to prevent password reuse.

**Core modules it connects to**: UserModule

**When to update**: When you need to enforce password history policies or custom
password tracking.

**Interface**: `UserPasswordHistoryServiceInterface` from `@concepta/nestjs-user`

**Configuration example**:

```typescript
services: {
  userPasswordHistoryService: new YourCustomPasswordHistoryService(), // Must implement UserPasswordHistoryServiceInterface
}
```

#### services.userAccessQueryService

**What it does**: Handles access control and permission queries.

**Core modules it connects to**: UserModule

**When to update**: When you need custom access control logic or integration
with external authorization systems.

**Interface**: `CanAccess` from `@concepta/nestjs-common`

**Configuration example**:

```typescript
services: {
  userAccessQueryService: new YourCustomAccessQueryService(), // Must implement CanAccess
}
```

#### services.mailerService (Required)

**What it does**: Core email sending service used throughout the system.

**Core modules it connects to**: EmailModule, AuthRecoveryModule,
AuthVerifyModule, OTP system

**When to update**: Always required. You must provide a working email service
for production.

**Interface**: `EmailServiceInterface` from `@concepta/nestjs-email`

**Configuration example**:

```typescript
services: {
  mailerService: new YourCustomMailerService(), // Must implement EmailServiceInterface
}
```

---

## Explanation

### Architecture Overview

The Rockets SDK follows a modular, layered architecture designed for
enterprise applications:

```mermaid
graph TB
    subgraph AL["Application Layer"]
        direction BT
        A[Controllers]
        B[DTOs]
        C[Swagger Docs]
    end
    
    subgraph SL["Service Layer"]
        direction BT
        D[Auth Services]
        E[User Services]
        F[OTP Services]
    end
    
    subgraph IL["Integration Layer"]
        direction BT
        G[JWT Module]
        H[Email Module]
        I[Password Module]
    end
    
    subgraph DL["Data Layer"]
        direction BT      
        J[TypeORM Integration]
        L[Custom Adapters]
    end
    
    AL --> SL
    SL --> IL
    IL --> DL
```

#### Core Components

1. **RocketsServerModule**: The main module that orchestrates all other modules
2. **Authentication Layer**: Handles JWT, local auth, refresh tokens
3. **User Management**: CRUD operations, profiles, password management
4. **OTP System**: One-time password generation and validation
5. **Email Service**: Template-based email notifications
6. **Data Layer**: TypeORM integration with adapter support

### Design Decisions

#### 1. Unified Module Approach

**Decision**: Combine multiple authentication modules into a single package.

**Rationale**:

- Reduces setup complexity for developers
- Ensures compatibility between modules
- Provides a consistent configuration interface
- Eliminates version conflicts between related packages

**Trade-offs**:

- Larger bundle size if only some features are needed
- Less granular control over individual module versions

#### 2. Configuration-First Design

**Decision**: Use extensive configuration objects rather than code-based setup.

**Rationale**:

- Enables environment-specific configurations
- Supports async configuration with dependency injection
- Makes the system more declarative and predictable
- Facilitates testing with different configurations

**Example**:

```typescript
// Configuration-driven approach
RocketsServerModule.forRoot({
  jwt: { settings: { /* ... */ } },
  user: { /* ... */ },
  otp: { /* ... */ },
});

// vs. imperative approach (not used)
const jwtModule = new JwtModule(jwtConfig);
const userModule = new UserModule(userConfig);
// ... manual wiring
```

#### 3. Adapter Pattern for Data Access

**Decision**: Use repository adapters instead of direct TypeORM coupling.

**Rationale**:

- Supports multiple database types and ORMs
- Enables custom data sources (APIs, NoSQL, etc.)
- Facilitates testing with mock repositories
- Provides flexibility for future data layer changes

**Implementation**: Uses the adapter pattern with a standardized repository
interface to support multiple database types and ORMs.

#### 4. Service Injection Pattern

**Decision**: Allow custom service implementations through dependency injection.

**Rationale**:

- Enables integration with existing systems
- Supports custom business logic
- Facilitates testing with mock services
- Maintains loose coupling between components

**Example**:

```typescript
services: {
  mailerService: new CustomMailerService(),
  userModelService: new CustomUserModelService(),
  notificationService: new CustomNotificationService(),
}
```

#### 5. Global vs Local Registration

**Decision**: Support both global and local module registration.

**Rationale**:

- Global registration simplifies common use cases
- Local registration provides fine-grained control
- Supports micro-service architectures
- Enables gradual adoption in existing applications

### Core Concepts

#### 1. Authentication Flow

The Rockets SDK implements a comprehensive authentication flow:

#### 1a. User Registration Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant CT as AuthSignupController
    participant PS as PasswordStorageService
    participant US as UserModelService
    participant D as Database
    
    C->>CT: POST /signup (email, username, password)
    CT->>PS: hashPassword(plainPassword)
    PS-->>CT: hashedPassword
    CT->>US: createUser(userData)
    US->>D: Save User Entity
    D-->>US: User Created
    US-->>CT: User Profile
    CT-->>C: 201 Created (User Profile)
```

**Services to customize for registration:**

- `PasswordStorageService` - Custom password hashing algorithms
- `UserModelService` - Custom user creation logic, validation, external systems integration

#### 1b. User Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as AuthLocalGuard
    participant ST as AuthLocalStrategy
    participant VS as AuthLocalValidateUserService
    participant US as UserModelService
    participant PV as PasswordValidationService
    participant D as Database
    
    C->>G: POST /token/password (username, password)
    G->>ST: Redirect to Strategy
    ST->>ST: Validate DTO Fields
    ST->>VS: validateUser(username, password)
    VS->>US: byUsername(username)
    US->>D: Find User by Username
    D-->>US: User Entity
    US-->>VS: User Found
    VS->>VS: isActive(user)
    VS->>PV: validate(user, password)
    PV-->>VS: Password Valid
    VS-->>ST: Validated User
    ST-->>G: Return User
    G-->>C: User Added to Request (@AuthUser)
```

**Services to customize for authentication:**

- `AuthLocalValidateUserService` - Custom credential validation logic
- `UserModelService` - Custom user lookup by username, email, or other fields
- `PasswordValidationService` - Custom password verification algorithms

#### 1c. Token Generation Flow

```mermaid
sequenceDiagram
    participant G as AuthLocalGuard
    participant CT as AuthPasswordController
    participant ITS as IssueTokenService
    participant JS as JwtService
    participant C as Client
    
    G->>CT: Request with Validated User (@AuthUser)
    CT->>ITS: responsePayload(user.id)
    ITS->>JS: signAsync(payload) - Access Token
    JS-->>ITS: Access Token
    ITS->>JS: signAsync(payload, {expiresIn: '7d'}) - Refresh Token
    JS-->>ITS: Refresh Token
    ITS-->>CT: {accessToken, refreshToken}
    CT-->>C: 200 OK (JWT Tokens)
```

**Services to customize for token generation:**

- `IssueTokenService` - Custom JWT payload, token expiration, additional claims
- `JwtService` - Custom signing algorithms, token structure

#### 1d. Protected Route Access Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as AuthJwtGuard
    participant ST as AuthJwtStrategy
    participant VTS as VerifyTokenService
    participant US as UserModelService
    participant D as Database
    participant CT as Controller
    
    C->>G: GET /user (Authorization: Bearer token)
    G->>ST: Redirect to JWT Strategy
    ST->>VTS: verifyToken(accessToken)
    VTS-->>ST: Token Valid & Payload
    ST->>US: bySubject(payload.sub)
    US->>D: Find User by Subject/ID
    D-->>US: User Entity
    US-->>ST: User Found
    ST-->>G: Return User
    G->>CT: Add User to Request (@AuthUser)
    CT->>D: Get Additional User Data (if needed)
    D-->>CT: User Data
    CT-->>C: 200 OK (Protected Resource)
```

**Services to customize for protected routes:**

- `VerifyTokenService` - Custom token verification logic, blacklist checking
- `UserModelService` - Custom user lookup by subject/ID, user status validation

#### 2. OTP Verification Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant OS as OTP Service
    participant D as Database
    participant E as Email Service
    
    Note over C,E: OTP Generation Flow
    C->>S: POST /otp (email)
    S->>OS: Generate OTP (RocketsServerOtpService)
    OS->>D: Store OTP with Expiry
    OS->>E: Send Email (NotificationService)
    E-->>OS: Email Sent
    S-->>C: 201 Created (OTP Sent)
    
    Note over C,E: OTP Verification Flow
    C->>S: PATCH /otp (email + passcode)
    S->>OS: Validate OTP Code
    OS->>D: Check OTP & Mark Used
    OS->>S: OTP Valid
    S->>S: Generate JWT Tokens (AuthLocalIssueTokenService)
    S-->>C: 200 OK (JWT Tokens)
```

#### 3. Token Refresh Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as AuthRefreshGuard
    participant ST as AuthRefreshStrategy
    participant VTS as VerifyTokenService
    participant US as UserModelService
    participant D as Database
    participant CT as RefreshController
    participant ITS as IssueTokenService
    
    Note over C,D: Token Refresh Request
    C->>G: POST /token/refresh (refreshToken in body)
    G->>ST: Redirect to Refresh Strategy
    ST->>VTS: verifyRefreshToken(refreshToken)
    VTS-->>ST: Token Valid & Payload
    ST->>US: bySubject(payload.sub)
    US->>D: Find User by Subject/ID
    D-->>US: User Entity
    US-->>ST: User Found & Active
    ST-->>G: Return User
    G->>CT: Add User to Request (@AuthUser)
    CT->>ITS: responsePayload(user.id)
    ITS-->>CT: New {accessToken, refreshToken}
    CT-->>C: 200 OK (New JWT Tokens)
```

**Services to customize for token refresh:**

- `VerifyTokenService` - Custom refresh token verification, token rotation logic
- `UserModelService` - Custom user validation, account status checking
- `IssueTokenService` - Custom new token generation, token rotation policies

#### 4. Password Recovery Flow

#### 4a. Recovery Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant CT as RecoveryController
    participant RS as AuthRecoveryService
    participant US as UserModelService
    participant OS as OtpService
    participant NS as NotificationService
    participant ES as EmailService
    participant D as Database
    
    C->>CT: POST /recovery/password (email)
    CT->>RS: recoverPassword(email)
    RS->>US: byEmail(email)
    US->>D: Find User by Email
    D-->>US: User Found (or null)
    US-->>RS: User Entity
    RS->>OS: create(otpConfig)
    OS->>D: Store OTP with Expiry
    D-->>OS: OTP Created
    OS-->>RS: OTP with Passcode
    RS->>NS: sendRecoverPasswordEmail(email, passcode, expiry)
    NS->>ES: sendMail(emailOptions)
    ES-->>NS: Email Sent
    RS-->>CT: Recovery Complete
    CT-->>C: 200 OK (Always success for security)
```

**Services to customize for recovery request:**

- `UserModelService` - Custom user lookup by email
- `OtpService` - Custom OTP generation, expiry logic
- `NotificationService` - Custom email templates, delivery methods
- `EmailService` - Custom email providers, formatting

#### 4b. Passcode Validation Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant CT as RecoveryController
    participant RS as AuthRecoveryService
    participant OS as OtpService
    participant D as Database
    
    C->>CT: GET /recovery/passcode/:passcode
    CT->>RS: validatePasscode(passcode)
    RS->>OS: validate(assignment, {category, passcode})
    OS->>D: Find & Validate OTP
    D-->>OS: OTP Valid & User ID
    OS-->>RS: Assignee Relation (or null)
    RS-->>CT: OTP Valid (or null)
    CT-->>C: 200 OK (Valid) / 404 (Invalid)
```

**Services to customize for passcode validation:**

- `OtpService` - Custom OTP validation, rate limiting

#### 4c. Password Update Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant CT as RecoveryController
    participant RS as AuthRecoveryService
    participant OS as OtpService
    participant US as UserModelService
    participant PS as UserPasswordService
    participant NS as NotificationService
    participant D as Database
    
    C->>CT: PATCH /recovery/password (passcode, newPassword)
    CT->>RS: updatePassword(passcode, newPassword)
    RS->>OS: validate(passcode, false)
    OS->>D: Validate OTP
    D-->>OS: OTP Valid & User ID
    OS-->>RS: Assignee Relation
    RS->>US: byId(assigneeId)
    US->>D: Find User by ID
    D-->>US: User Entity
    US-->>RS: User Found
    RS->>PS: setPassword(newPassword, userId)
    PS->>D: Update User Password
    D-->>PS: Password Updated
    RS->>NS: sendPasswordUpdatedSuccessfullyEmail(email)
    RS->>OS: clear(assignment, {category, assigneeId})
    OS->>D: Revoke All User Recovery OTPs
    RS-->>CT: User Entity (or null)
    CT-->>C: 200 OK (Success) / 400 (Invalid OTP)
```

**Services to customize for password update:**

- `OtpService` - Custom OTP validation and cleanup
- `UserModelService` - Custom user lookup validation
- `UserPasswordService` - Custom password hashing, policies
- `NotificationService` - Custom success notifications

---

This comprehensive documentation provides developers with everything they need
to understand, implement, and extend the Rockets SDK in their applications.
The modular design and extensive configuration options make it suitable for
projects ranging from simple prototypes to complex enterprise systems.
