# Role-Based Access Control Implementation Guide

This guide documents the implementation of a comprehensive role-based access control (RBAC) system with default user roles and ownership-based permissions.

## Overview

The system implements:

1. **Default User Role Assignment**: Automatically assigns a default "user" role to new signups
2. **Ownership-Based Permissions**: Users can only access their own resources
3. **Role Hierarchy**:
   - **admin**: Full access to all resources (create, read, update, delete any)
   - **manager**: Can create, read, and update any resource, but cannot delete
   - **user**: Can only access their own resources (create, read, update, delete own)

## User Role Data Structure

The `AuthorizedUser` interface uses a nested structure that matches the database schema:

```typescript
export interface AuthorizedUser {
  id: string;
  sub: string;
  email?: string;
  userRoles?: { role: { name: string } }[];  // Nested role structure
  claims?: Record<string, unknown>;
}
```

**Example authenticated user:**
```json
{
  "id": "user-uuid",
  "sub": "user-uuid",
  "email": "user@example.com",
  "userRoles": [
    { "role": { "name": "user" } }
  ]
}
```

**Extracting role names:**
```typescript
const roleNames = user.userRoles?.map(ur => ur.role.name) || [];
// Result: ['user']
```

This structure:
- Avoids conflicts with custom code that may use `roles` property
- Matches the database schema (`user → userRoles → role`)
- Allows for future expansion (e.g., role metadata, permissions)

## Implementation Changes

### 1. Configuration Settings

**File**: `packages/rockets-server-auth/src/shared/interfaces/rockets-auth-settings.interface.ts`

Added `defaultUserRoleName` to the role settings:

```typescript
export interface RocketsAuthSettingsInterface {
  role: {
    adminRoleName: string;
    defaultUserRoleName?: string; // New: optional default role for users
  };
  // ... other settings
}
```

**File**: `packages/rockets-server-auth/src/shared/config/rockets-auth-options-default.config.ts`

Added default configuration with environment variable support:

```typescript
role: {
  adminRoleName: process.env?.ADMIN_ROLE_NAME ?? 'admin',
  defaultUserRoleName: process.env?.DEFAULT_USER_ROLE_NAME ?? 'user',
}
```

### 2. Automatic Role Assignment on Signup

**File**: `packages/rockets-server-auth/src/domains/user/modules/rockets-auth-signup.module.ts`

Modified the `SignupCrudService` to automatically assign the default role to new users:

```typescript
// After creating user and metadata
if (this.settings.role.defaultUserRoleName) {
  try {
    const defaultRoles = await this.roleModelService.find({
      where: { name: this.settings.role.defaultUserRoleName },
    });
    
    if (defaultRoles && defaultRoles.length > 0) {
      await this.roleService.assignRole({
        assignment: 'user',
        assignee: { id: created.id },
        role: { id: defaultRoles[0].id },
      });
    }
  } catch (error) {
    // Log but don't fail signup if role assignment fails
    console.warn(`Failed to assign default role: ${errorMessage}`);
  }
}
```

### 3. Fallback in Access Control Service

**File**: `examples/sample-server-auth/src/access-control.service.ts`

Extracts role names from the `userRoles` nested structure:

```typescript
async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
  const request = context.switchToHttp().getRequest();
  const jwtUser = await this.getUser<{ 
    id: string; 
    userRoles?: { role: { name: string } }[] 
  }>(context);
  
  if (!jwtUser || !jwtUser.id) {
    throw new UnauthorizedException('User is not authenticated');
  }
  
  // Extract role names from nested structure
  const roles = jwtUser.userRoles?.map(ur => ur.role.name) || [];
  
  return roles;
}
```

### 4. ACL Rules with Ownership Permissions

**File**: `examples/sample-server-auth/src/app.acl.ts`

Added the "user" role with ownership-based permissions:

```typescript
export enum AppRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user', // New
}

// Admin: full access
acRules
  .grant([AppRole.Admin])
  .resource(allResources)
  .create()
  .read()
  .update()
  .delete();

// Manager: can't delete
acRules
  .grant([AppRole.Manager])
  .resource(allResources)
  .create()
  .read()
  .update();

// User: can only access own resources
acRules
  .grant([AppRole.User])
  .resource(allResources)
  .createOwn()
  .readOwn()
  .updateOwn()
  .deleteOwn();
```

### 5. Ownership Verification Service

**File**: `examples/sample-server-auth/src/modules/pet/domains/pet/pet-access-query.service.ts`

Implemented ownership checking logic:

```typescript
async canAccess(context: AccessControlContextInterface): Promise<boolean> {
  const user = context.getUser() as { id: string };
  const query = context.getQuery();
  const request = context.getRequest() as { params?: { id?: string } };

  // If permission is 'any', allow
  if (query.possession === 'any') {
    return true;
  }

  // For 'own' possession, verify ownership
  if (query.possession === 'own') {
    // For create, automatically allow
    if (query.action === 'create') {
      return true;
    }

    // For read/update/delete single resource, check ownership
    const petId = request.params?.id;
    if (petId) {
      const pet = await this.petModelService.byId(petId);
      return pet && pet.userId === user.id;
    }
    
    // For list operations, allow (will be filtered by service)
    return true;
  }

  return false;
}
```

### 6. Bootstrap Ensures Default Role Exists

**File**: `examples/sample-server-auth/src/main.ts`

Added function to ensure the default "user" role exists:

```typescript
async function ensureDefaultUserRole(app: INestApplication) {
  const roleModelService = app.get(RoleModelService);
  
  const defaultUserRoleName = 'user';
  let userRole = (
    await roleModelService.find({ where: { name: defaultUserRoleName } })
  )?.[0];
  
  if (!userRole) {
    await roleModelService.create({
      name: defaultUserRoleName,
      description: 'Default role for authenticated users',
    });
  }
}

// Called in bootstrap
await ensureInitialAdmin(app);
await ensureManagerRole(app);
await ensureDefaultUserRole(app); // New
```

## Testing

### Test Scenarios

#### Scenario 1: Admin User
```bash
# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"StrongP@ssw0rd"}'

# Create pet (any userId)
curl -X POST http://localhost:3000/pets \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin Dog","species":"Dog","age":3,"userId":"any-user-id"}'

# Get all pets (sees everyone's)
curl -X GET http://localhost:3000/pets \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Delete any pet
curl -X DELETE http://localhost:3000/pets/$PET_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Scenario 2: Regular User
```bash
# Signup (automatically gets "user" role)
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"user@test.com","email":"user@test.com","password":"Pass123!","active":true}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@test.com","password":"Pass123!"}'

# Create own pet
curl -X POST http://localhost:3000/pets \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Cat","species":"Cat","age":2,"userId":"$MY_USER_ID"}'

# Get pets (only sees own)
curl -X GET http://localhost:3000/pets \
  -H "Authorization: Bearer $USER_TOKEN"

# Try to access another user's pet (403 Forbidden)
curl -X GET http://localhost:3000/pets/$OTHER_USER_PET_ID \
  -H "Authorization: Bearer $USER_TOKEN"
```

#### Scenario 3: Manager User
```bash
# Signup as manager (admin assigns role)
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"manager@test.com","email":"manager@test.com","password":"Pass123!","active":true}'

# Admin assigns manager role
curl -X POST http://localhost:3000/admin/users/$MANAGER_USER_ID/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId":"$MANAGER_ROLE_ID"}'

# Login as manager
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager@test.com","password":"Pass123!"}'

# Get all pets (sees all)
curl -X GET http://localhost:3000/pets \
  -H "Authorization: Bearer $MANAGER_TOKEN"

# Update any pet (succeeds)
curl -X PATCH http://localhost:3000/pets/$ANY_PET_ID \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Try to delete (403 Forbidden)
curl -X DELETE http://localhost:3000/pets/$ANY_PET_ID \
  -H "Authorization: Bearer $MANAGER_TOKEN"
```

## Environment Variables

Configure the default role via environment variables:

```bash
# .env file
DEFAULT_USER_ROLE_NAME=user     # Default role assigned on signup
ADMIN_ROLE_NAME=admin           # Admin role name
```

## Architecture Decisions

### Database-Agnostic Approach
- Uses `ModelService` patterns instead of TypeORM-specific code
- `RoleModelService.find()` works with any database adapter
- No TypeORM relations in access control logic

### Security Best Practices
- Roles are loaded during JWT validation (no N+1 queries)
- Ownership verified at query time (prevents IDOR attacks)
- Fallback to default role prevents "Invalid role" errors
- Access denied by default (fail-closed security)

### Scalability Considerations
- Role names cached in JWT (reduces database queries)
- Ownership checks only for single-resource operations
- List operations can be filtered efficiently by the database

## Troubleshooting

### Issue: "Invalid role(s): []"
**Cause**: User has no roles assigned and no default role configured

**Solution**: 
1. Ensure `DEFAULT_USER_ROLE_NAME` is set
2. Ensure "user" role exists in database
3. Check that `ensureDefaultUserRole()` ran during bootstrap

### Issue: User can't access their own resources
**Cause**: `userId` field mismatch or ownership check failing

**Solution**:
1. Verify `userId` is set correctly when creating resources
2. Check `PetAccessQueryService` logs for ownership checks
3. Ensure user ID matches the resource's userId field

### Issue: Manager can delete (should be denied)
**Cause**: ACL rules not properly configured

**Solution**:
1. Verify ACL rules don't grant delete permission to manager
2. Check that AccessControlGuard is enabled
3. Ensure roles are loaded correctly in JWT

## Future Enhancements

Potential improvements to consider:

1. **Resource-Level Permissions**: Different permissions for different resource types
2. **Role Hierarchies**: Automatic permission inheritance
3. **Dynamic Permissions**: Database-driven permission rules
4. **Audit Logging**: Track all access control decisions
5. **Permission Caching**: Cache permission checks for performance

## Additional Resources

- [AccessControl Library Documentation](https://www.npmjs.com/package/accesscontrol)
- [Rockets Auth Module Documentation](../../packages/rockets-server-auth/README.md)
- [Access Control Guide](../../development-guides/ACCESS_CONTROL_GUIDE.md)

