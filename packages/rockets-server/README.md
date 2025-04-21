# Rockets Server Module Documentation

## Project

[![NPM Latest](https://img.shields.io/npm/v/@concepta/rockets-server)](https://www.npmjs.com/package/@concepta/rockets-server)
[![NPM Downloads](https://img.shields.io/npm/dw/@concepta/rockets-server)](https://www.npmjs.com/package/@concepta/rockets-server)
[![GH Last Commit](https://img.shields.io/github/last-commit/conceptadev/rockets?logo=github)](https://github.com/conceptadev/rockets)
[![GH Contrib](https://img.shields.io/github/contributors/conceptadev/rockets?logo=github)](https://github.com/conceptadev/rockets/graphs/contributors)
[![NestJS Dep](https://img.shields.io/github/package-json/dependency-version/conceptadev/rockets/@nestjs/common?label=NestJS&logo=nestjs&filename=packages%2Fnestjs-core%2Fpackage.json)](https://www.npmjs.com/package/@nestjs/common)

## Table of Contents

- [Tutorials](#tutorials)
  - [Introduction](#introduction)
    - [Overview of the Library](#overview-of-the-library)
    - [Purpose and Key Features](#purpose-and-key-features)
    - [Installation](#installation)
  - [Getting Started](#getting-started)
    - [Overview](#overview)
    - [Basic Setup](#basic-setup)
    - [Complete Setup in a NestJS Project](#complete-setup-in-a-nestjs-project)
      - [Step 1: Install Dependencies](#step-1-install-dependencies)
      - [Step 2: Create Entities](#step-2-create-entities)
      - [Step 3: Configure the Module](#step-3-configure-the-module)
      - [Step 4: Using the Module](#step-4-using-the-module)
    - [Authentication with RocketsServer](#authentication-with-rocketsserver)
      - [Validating the Setup](#validating-the-setup)
      - [Example API Requests](#example-api-requests)
- [How to Guides](#how-to-guides)
  - [1. How to Configure RocketsServerModule Settings](#1-how-to-configure-rocketsservermodule-settings)
  - [2. How to Extend the Built-in DTOs](#2-how-to-extend-the-built-in-dtos)
  - [3. How to Generate Swagger Documentation](#3-how-to-generate-swagger-documentation)
- [Explanation](#explanation)
  - [Conceptual Overview](#conceptual-overview)
    - [What is This Library?](#what-is-this-library)
    - [Benefits of Using This Library](#benefits-of-using-this-library)
  - [Design Choices](#design-choices)
    - [Integrated Authentication Approach](#integrated-authentication-approach)
    - [Global vs Local Registration](#global-vs-local-registration)
  - [Integration Details](#integration-details)
    - [Integrating with Other Modules](#integrating-with-other-modules)

# Tutorials

## Introduction

### Overview of the Library

The RocketsServer module is a comprehensive solution that integrates multiple
Rockets authentication and user management modules into a cohesive package for
NestJS applications. It simplifies the process of setting up authentication,
user management, and API documentation by providing a unified configuration
interface and pre-configured controllers.

The module combines JWT authentication, local authentication, user management,
and other essential features into a single, easy-to-use package that follows
best practices for NestJS application development.

### Purpose and Key Features

- **Integrated Authentication System**: Provides a complete authentication
  system with JWT tokens, local authentication, and refresh token capabilities.
- **User Management**: Built-in user management with registration, profile
  management, and password recovery.
- **OTP (One-Time Password) Support**: Includes OTP generation and validation
  for secure authentication processes.
- **Email Notifications**: Built-in email notification service for user-related
  events like registration and password recovery.
- **Swagger Documentation**: Automatic generation of OpenAPI/Swagger
  documentation for your API endpoints.
- **Extensibility**: Easy to extend with custom DTOs, entities, and services to
  meet specific application requirements.
- **TypeORM Integration**: Seamless integration with TypeORM for database
  operations.
- **Configurable Settings**: Extensive configuration options to customize the
  behavior of the module.

#### Installation

To get started, install the `RocketsServer` package:

```sh
yarn add @concepta/rockets-server
```

## Getting Started

### Overview

This section covers the basics of setting up the `RocketsServer` module in a
NestJS application.

### Basic Setup

The `@concepta/rockets-server` module is designed to integrate multiple
authentication and user management modules into a cohesive package. It includes
the following core modules:

- `@concepta/nestjs-authentication`: Core authentication services
- `@concepta/nestjs-auth-jwt`: JWT-based authentication
- `@concepta/nestjs-auth-local`: Local authentication (username/password)
- `@concepta/nestjs-auth-refresh`: Refresh token handling
- `@concepta/nestjs-user`: User management
- `@concepta/nestjs-otp`: One-time password support

For optimal functionality, it's recommended to use the `RocketsServer` module
as it provides a pre-configured setup for all these components.

### Complete Setup in a NestJS Project

#### Step 1: Install Dependencies

Start by installing the necessary packages:

```sh
yarn add @concepta/rockets-server @nestjs/typeorm typeorm sqlite3
```

#### Step 2: Create Entities

Create the required entities by extending the base entities provided by the
module:

```typescript
// user.entity.ts
import { Entity } from 'typeorm';
import { UserSqliteEntity } from '@concepta/nestjs-user';

@Entity()
export class UserEntity extends UserSqliteEntity {}
```

```typescript
// user-otp.entity.ts
import { Entity } from 'typeorm';
import { OtpSqliteEntity } from '@concepta/nestjs-otp';
import { UserEntity } from './user.entity';

@Entity()
export class UserOtpEntity extends OtpSqliteEntity {
  assignee: UserEntity;
}
```

#### Step 3: Configure the Module

Configure the `RocketsServerModule` in your application module:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RocketsServerModule } from '@concepta/rockets-server';
import { UserEntity } from './entities/user.entity';
import { UserOtpEntity } from './entities/user-otp.entity';

@Module({
  imports: [
    RocketsServerModule.forRoot({
      // Database configuration
      typeorm: {
        type: 'sqlite',
        database: 'rockets.sqlite',
        synchronize: true,
        autoLoadEntities: true,
      },
      // JWT settings
      jwt: {
        settings: {
          access: { 
            secret: 'your-access-token-secret', 
            expiresIn: '15m' 
          },
          refresh: { 
            secret: 'your-refresh-token-secret', 
            expiresIn: '7d' 
          },
          default: { 
            secret: 'your-default-secret' 
          },
        },
      },
      // Entity mappings
      entities: {
        user: { entity: UserEntity },
        userOtp: { entity: UserOtpEntity },
      },
      // Email settings
      settings: {
        email: {
          from: 'noreply@example.com',
          baseUrl: 'http://localhost:3000',
          templates: {
            sendOtp: {
              fileName: 'otp-email.hbs',
              subject: 'Your verification code',
            },
          },
        },
      },
      // Email service implementation
      services: {
        mailerService: {
          sendMail: (options) => {
            console.log('Would send email:', options);
            return Promise.resolve();
          },
        },
      },
    }),
  ],
})
export class AppModule {}
```

#### Step 4: Using the Module

Once configured, the module provides several ready-to-use endpoints for
authentication, user management, and other features. You can access these
endpoints through the built-in controllers:

- `/auth/login`: Log in with username and password
- `/auth/refresh`: Refresh an access token
- `/auth/password`: Change password
- `/auth/recovery`: Initiate password recovery
- `/auth/signup`: Register a new user
- `/otp`: OTP generation and validation
- `/user`: User management (create, read, update, delete)

### Authentication with RocketsServer

#### Validating the Setup

To validate your setup, start your application and make requests to the
provided endpoints.

#### Example API Requests

Here are some example API requests to test your setup:

##### 1. Register a new user

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!", 
      "username": "testuser"}'
```

##### 2. Log in and obtain a JWT token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Password123!"}'
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### 3. Access a protected endpoint

```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

##### 4. Refresh an access token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

## How to Guides

### 1. How to Configure RocketsServerModule Settings

The `RocketsServerModule` provides extensive configuration options to customize
its behavior. Here's how to configure some common settings:

#### Email Configuration

```typescript
RocketsServerModule.forRoot({
  settings: {
    email: {
      from: 'noreply@example.com',
      baseUrl: 'https://yourdomain.com',
      // Custom token URL formatter
      tokenUrlFormatter: (baseUrl, passcode) => 
        `${baseUrl}/verify?token=${passcode}`,
      templates: {
        sendOtp: {
          fileName: 'custom-otp-template.hbs',
          subject: 'Your verification code',
        },
      },
    },
  },
}),
```

#### OTP Settings

```typescript
RocketsServerModule.forRoot({
  settings: {
    otp: {
      expiresIn: 3600, // 1 hour in seconds
      length: 6, // 6-digit code
    },
  },
}),
```

#### JWT Settings

```typescript
RocketsServerModule.forRoot({
  jwt: {
    settings: {
      access: { 
        secret: 'your-access-token-secret', 
        expiresIn: '15m',
        // Other options from @nestjs/jwt
      },
      refresh: { 
        secret: 'your-refresh-token-secret', 
        expiresIn: '7d' 
      },
      default: { 
        secret: 'your-default-secret' 
      },
    },
  },
}),
```

### 2. How to Extend the Built-in DTOs

The `RocketsServer` module provides several DTOs that you can extend to add
custom properties:

#### Custom User DTO

```typescript
// custom-user.dto.ts
import { RocketsServerUserDto } from '@concepta/rockets-server';
import { ApiProperty } from '@nestjs/swagger';

export class CustomUserDto extends RocketsServerUserDto {
  @ApiProperty({ description: 'User profile picture URL' })
  profilePicture?: string;
  
  @ApiProperty({ description: 'User preferred language' })
  language?: string;
}
```

#### Custom Login DTO

```typescript
// custom-login.dto.ts
import { RocketsServerLoginDto } from '@concepta/rockets-server';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CustomLoginDto extends RocketsServerLoginDto {
  @ApiProperty({ description: 'Remember user login', required: false })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
```

### 3. How to Generate Swagger Documentation

The RocketsServer module includes a built-in Swagger documentation generator
that can automatically create OpenAPI documentation from your controllers.

#### Using the NPM Script

Add the following script to your `package.json`:

```json
{
  "scripts": {
    "generate-swagger": "rockets-swagger"
  }
}
```

Then run:

```sh
npm run generate-swagger
```

This will generate a `swagger.json` file in the `swagger` directory at the root
of your project.

#### Using the CLI Tool

If you've installed the package globally or are running it from another
package, you can use the CLI tool:

```sh
# If installed globally
rockets-swagger

# Or using npx
npx rockets-swagger
```

#### Programmatic Usage

You can also use the generator programmatically in your own code:

```typescript
import { generateSwaggerJson } from '@concepta/rockets-server';

// Generate the Swagger documentation
generateSwaggerJson()
  .then(() => console.log('Swagger generation complete'))
  .catch(err => console.error('Error generating Swagger:', err));
```

## Explanation

### Conceptual Overview

#### What is This Library?

The `@concepta/rockets-server` library is a comprehensive solution that
combines multiple authentication and user management modules into a cohesive
package for NestJS applications. It simplifies the process of setting up
authentication, user management, and API documentation by providing a unified
configuration interface and pre-configured controllers.

The module integrates seamlessly with TypeORM and provides a complete set of
features for building secure and scalable NestJS applications.

#### Benefits of Using This Library

- **Simplified Setup**: Provides a pre-configured setup that integrates
  multiple authentication and user management modules.
- **Comprehensive Features**: Includes authentication, user management, OTP
  support, and email notifications out of the box.
- **Type Safety**: Built with TypeScript for type safety and better development
  experience.
- **Extensibility**: Easy to extend and customize to meet specific application
  requirements.
- **Best Practices**: Follows NestJS best practices for module design and
  implementation.
- **API Documentation**: Built-in Swagger documentation generator for your API
  endpoints.

### Design Choices

#### Integrated Authentication Approach

The RocketsServer module takes an integrated approach to authentication by
combining JWT authentication, local authentication, and refresh token handling
into a single module. This approach simplifies the setup process and ensures
that all authentication components work together seamlessly.

The module also provides built-in controllers for common authentication
operations, such as login, signup, and password recovery, which reduces the
amount of boilerplate code you need to write.

#### Global vs Local Registration

The RocketsServer module supports two registration methods:

- **Global Registration**: Makes the module and its features available
  throughout the entire application. This is the default behavior when using
  `forRoot()`.
- **Local Registration**: Makes the module available only to the module that
  imports it. This can be useful when you want to limit the scope of the
  module.

```typescript
// Global registration (default)
RocketsServerModule.forRoot({
  // options...
});

// Local registration
RocketsServerModule.forRoot({
  // options...
  global: false,
});
```

### Integration Details

#### Integrating with Other Modules

The RocketsServer module is designed to work with other Rockets and NestJS
modules. Here are some integration examples:

##### Integrating with custom database entities

```typescript
// custom-user.entity.ts
import { Entity, Column } from 'typeorm';
import { UserSqliteEntity } from '@concepta/nestjs-user';

@Entity()
export class CustomUserEntity extends UserSqliteEntity {
  @Column({ nullable: true })
  profilePicture?: string;
  
  @Column({ default: 'en' })
  language: string;
}

// In your module configuration
RocketsServerModule.forRoot({
  entities: {
    user: { entity: CustomUserEntity },
    // Other entities...
  },
  // Other options...
});
```

##### Integrating with custom services

```typescript
// custom-mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerServiceInterface } from '@concepta/nestjs-email';

@Injectable()
export class CustomMailerService implements MailerServiceInterface {
  async sendMail(options: any): Promise<any> {
    // Custom email sending logic
    console.log('Sending email:', options);
    // Integration with your email service provider
    return Promise.resolve();
  }
}

// In your module configuration
RocketsServerModule.forRoot({
  services: {
    mailerService: new CustomMailerService(),
  },
  // Other options...
});
```

By using these integration patterns, you can customize the behavior of the
RocketsServer module to meet your specific application requirements while still
benefiting from the pre-configured features it provides.
