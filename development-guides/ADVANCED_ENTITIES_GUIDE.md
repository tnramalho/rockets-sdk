# Advanced Entity Patterns Guide

This guide focuses on advanced entity patterns, complex relationships, and performance optimization techniques when working with the Rockets SDK. It covers enterprise-level patterns for extending SDK entities and implementing complex business domains.

## Table of Contents

1. [Introduction to Advanced Entity Patterns](#introduction-to-advanced-entity-patterns)
2. [Custom User Entity Extension Patterns](#custom-user-entity-extension-patterns)
3. [Role, UserRole, UserOtp, and Federated Entity Examples](#role-userrole-userotp-and-federated-entity-examples)
4. [Complex Relationship Management Patterns](#complex-relationship-management-patterns)
5. [Database View Patterns for Complex Queries](#database-view-patterns-for-complex-queries)
6. [Entity Inheritance Patterns](#entity-inheritance-patterns)
7. [Advanced TypeORM Patterns for SDK Integration](#advanced-typeorm-patterns-for-sdk-integration)
8. [Performance Optimization Techniques for Entities](#performance-optimization-techniques-for-entities)

## Introduction to Advanced Entity Patterns

The Rockets SDK provides a robust foundation for building enterprise applications with complex entity relationships. This guide covers advanced patterns that go beyond basic CRUD operations to handle sophisticated business domains.

### Core Principles

- **Separation of Concerns**: Business logic in services, data access through adapters
- **Type Safety**: Comprehensive interfaces and proper TypeScript patterns
- **Extensibility**: Proper inheritance and composition patterns
- **Performance**: Optimized queries and caching strategies
- **Maintainability**: Consistent patterns and clear abstractions

### When to Use Advanced Patterns

Use these patterns when you need:
- Complex multi-entity relationships
- Custom business validation logic
- Performance-optimized read operations
- Domain-specific entity behaviors
- Integration with external systems

## Custom User Entity Extension Patterns

### Basic User Entity Extension

The foundation of most advanced patterns starts with properly extending the base User entity:

```typescript
// entities/user.entity.ts
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserOtpEntity } from './user-otp.entity';
import { FederatedEntity } from './federated.entity';
import { UserEntityInterface } from '../interfaces/user/user-entity.interface';

@Entity('user')
@Index(['email', 'active']) // Performance optimization
@Index(['username', 'active']) // Performance optimization
export class UserEntity extends UserSqliteEntity implements UserEntityInterface {
  // Personal Information
  @Column({ type: 'integer', nullable: true })
  age?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index() // For searching by name
  firstName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index() // For searching by name
  lastName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phoneNumber?: string;

  // Metadata Fields
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'boolean', default: false })
  isVerified?: boolean;

  @Column({ type: 'datetime', nullable: true })
  @Index() // For analytics and session management
  lastLoginAt?: Date;

  @Column({ type: 'json', nullable: true })
  preferences?: Record<string, any>;

  @Column({ type: 'varchar', length: 10, nullable: true })
  timezone?: string;

  // Relationships
  @OneToMany(() => UserOtpEntity, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntity[];

  @OneToMany(() => FederatedEntity, (federated) => federated.assignee)
  federatedAccounts?: FederatedEntity[];

  // Business Logic Methods
  getFullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }

  isProfileComplete(): boolean {
    return !!(this.firstName && this.lastName && this.phoneNumber);
  }
}
```

### Advanced User Interface Pattern

```typescript
// interfaces/user/user-entity.interface.ts
import { RocketsServerUserEntityInterface } from '@bitwild/rockets-server';

export interface UserEntityInterface extends RocketsServerUserEntityInterface {
  // Personal Information
  age?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;

  // Metadata
  tags?: string[];
  isVerified?: boolean;
  lastLoginAt?: Date;
  preferences?: Record<string, any>;
  timezone?: string;

  // Relationships
  userOtps?: UserOtpEntity[];
  federatedAccounts?: FederatedEntity[];

  // Business Methods
  getFullName(): string;
  isProfileComplete(): boolean;
}
```

### User Metadata Entity Pattern

For complex user metadata that requires its own CRUD operations:

```typescript
// entities/user-metadata.entity.ts
import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { AuditSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';

@Entity('user_metadata')
@Index(['userId']) // Performance for user lookups
export class UserMetadataEntity extends AuditSqliteEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  userId!: string;

  @Column({ type: 'json', nullable: true })
  personalInfo?: {
    bio?: string;
    website?: string;
    location?: string;
    occupation?: string;
  };

  @Column({ type: 'json', nullable: true })
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };

  @Column({ type: 'json', nullable: true })
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profilePublic?: boolean;
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
```

## Role, UserRole, UserOtp, and Federated Entity Examples

### Advanced Role Entity with Permissions

```typescript
// entities/role.entity.ts
import { Entity, Column, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { RoleSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserRoleEntity } from './user-role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role')
@Index(['name', 'active']) // Performance for role lookups
export class RoleEntity extends RoleSqliteEntity {
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', default: 0 })
  @Index() // For role hierarchy
  priority?: number;

  @Column({ type: 'boolean', default: true })
  isSystemRole?: boolean;

  @Column({ type: 'json', nullable: true })
  restrictions?: {
    maxUsers?: number;
    allowedDomains?: string[];
    timeRestrictions?: {
      startTime?: string;
      endTime?: string;
      timezone?: string;
    };
  };

  // Relationships
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles?: UserRoleEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions?: PermissionEntity[];

  // Business Methods
  hasPermission(permissionName: string): boolean {
    return this.permissions?.some(p => p.name === permissionName) ?? false;
  }

  canAssignToUser(userCount: number): boolean {
    return !this.restrictions?.maxUsers || userCount < this.restrictions.maxUsers;
  }
}
```

### Enhanced UserRole Entity with Temporal Data

```typescript
// entities/user-role.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { RoleAssignmentSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('user_role')
@Index(['userId', 'roleId', 'active']) // Composite index for performance
@Index(['validFrom', 'validUntil']) // For temporal queries
export class UserRoleEntity extends RoleAssignmentSqliteEntity {
  @Column({ type: 'datetime', nullable: true })
  validFrom?: Date;

  @Column({ type: 'datetime', nullable: true })
  validUntil?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedBy?: string;

  @Column({ type: 'text', nullable: true })
  assignmentReason?: string;

  @Column({ type: 'json', nullable: true })
  context?: {
    department?: string;
    project?: string;
    location?: string;
  };

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  role!: RoleEntity;

  @ManyToOne(() => UserEntity, (user) => user.userRoles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  assignee!: UserEntity;

  // Business Methods
  isCurrentlyValid(): boolean {
    const now = new Date();
    const validFrom = this.validFrom || new Date(0);
    const validUntil = this.validUntil || new Date('2099-12-31');
    
    return now >= validFrom && now <= validUntil;
  }

  isExpiringSoon(days: number = 30): boolean {
    if (!this.validUntil) return false;
    
    const now = new Date();
    const expirationThreshold = new Date();
    expirationThreshold.setDate(now.getDate() + days);
    
    return this.validUntil <= expirationThreshold && this.validUntil > now;
  }
}
```

### Advanced UserOtp Entity with Categories

```typescript
// entities/user-otp.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { OtpSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';

export enum OtpCategory {
  VERIFICATION = 'verification',
  PASSWORD_RESET = 'password_reset',
  TWO_FACTOR = 'two_factor',
  ACCOUNT_RECOVERY = 'account_recovery',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
}

@Entity('user_otp')
@Index(['category', 'expiresAt']) // For cleanup and validation queries
@Index(['assigneeId', 'category', 'active']) // For user-specific OTP queries
export class UserOtpEntity extends OtpSqliteEntity {
  @Column({
    type: 'varchar',
    length: 50,
    default: OtpCategory.VERIFICATION,
  })
  @Index() // For category-based queries
  category!: OtpCategory;

  @Column({ type: 'integer', default: 0 })
  attemptCount?: number;

  @Column({ type: 'integer', default: 3 })
  maxAttempts?: number;

  @Column({ type: 'datetime', nullable: true })
  lastAttemptAt?: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    purpose?: string;
    additionalData?: Record<string, any>;
  };

  @ManyToOne(() => UserEntity, (user) => user.userOtps, {
    onDelete: 'CASCADE',
  })
  assignee!: UserEntity;

  // Business Methods
  canAttempt(): boolean {
    return (this.attemptCount || 0) < (this.maxAttempts || 3);
  }

  incrementAttempt(): void {
    this.attemptCount = (this.attemptCount || 0) + 1;
    this.lastAttemptAt = new Date();
  }

  isRateLimited(): boolean {
    if (!this.lastAttemptAt) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - this.lastAttemptAt.getTime();
    const cooldownPeriod = 60000; // 1 minute in milliseconds
    
    return timeDiff < cooldownPeriod;
  }
}
```

### Enhanced Federated Entity for OAuth Management

```typescript
// entities/federated.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { FederatedSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';

export enum FederatedProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  MICROSOFT = 'microsoft',
  APPLE = 'apple',
}

@Entity('federated')
@Index(['provider', 'externalId'], { unique: true }) // Prevent duplicate accounts
@Index(['assigneeId', 'provider']) // For user federated account queries
export class FederatedEntity extends FederatedSqliteEntity {
  @Column({
    type: 'varchar',
    length: 50,
  })
  provider!: FederatedProvider;

  @Column({ type: 'varchar', length: 255 })
  externalId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalEmail?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalUsername?: string;

  @Column({ type: 'text', nullable: true })
  accessToken?: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  @Column({ type: 'datetime', nullable: true })
  tokenExpiresAt?: Date;

  @Column({ type: 'json', nullable: true })
  profile?: {
    name?: string;
    email?: string;
    picture?: string;
    locale?: string;
    verified?: boolean;
  };

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt?: Date;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.federatedAccounts, {
    onDelete: 'CASCADE',
  })
  assignee!: UserEntity;

  // Business Methods
  isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return false;
    return new Date() >= this.tokenExpiresAt;
  }

  needsTokenRefresh(): boolean {
    if (!this.tokenExpiresAt) return false;
    
    // Refresh if token expires in next 5 minutes
    const now = new Date();
    const refreshThreshold = new Date(now.getTime() + 5 * 60 * 1000);
    
    return this.tokenExpiresAt <= refreshThreshold;
  }

  updateFromProfile(profile: any): void {
    this.profile = {
      ...this.profile,
      ...profile,
    };
    this.lastSyncAt = new Date();
  }
}
```

## Complex Relationship Management Patterns

### Many-to-Many with Rich Junction Tables

```typescript
// entities/project-member.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { AuditSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

export enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
  LEFT = 'left',
}

@Entity('project_member')
@Index(['projectId', 'userId'], { unique: true })
@Index(['role', 'status'])
export class ProjectMemberEntity extends AuditSqliteEntity {
  @Column({ type: 'varchar', nullable: false })
  projectId!: string;

  @Column({ type: 'varchar', nullable: false })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ProjectRole.MEMBER,
  })
  role!: ProjectRole;

  @Column({
    type: 'varchar',
    length: 20,
    default: MembershipStatus.ACTIVE,
  })
  status!: MembershipStatus;

  @Column({ type: 'datetime', nullable: true })
  joinedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  invitedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invitedBy?: string;

  @Column({ type: 'text', nullable: true })
  invitationMessage?: string;

  @Column({ type: 'json', nullable: true })
  permissions?: {
    canInvite?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canManageMembers?: boolean;
  };

  @ManyToOne(() => ProjectEntity, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  project!: ProjectEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user!: UserEntity;

  // Business Methods
  hasPermission(permission: string): boolean {
    if (this.status !== MembershipStatus.ACTIVE) return false;
    
    // Owners and admins have all permissions
    if (this.role === ProjectRole.OWNER || this.role === ProjectRole.ADMIN) {
      return true;
    }
    
    // Check specific permissions
    return this.permissions?.[permission] ?? false;
  }

  canPromoteTo(role: ProjectRole): boolean {
    const roleHierarchy = {
      [ProjectRole.VIEWER]: 0,
      [ProjectRole.MEMBER]: 1,
      [ProjectRole.ADMIN]: 2,
      [ProjectRole.OWNER]: 3,
    };
    
    return roleHierarchy[role] > roleHierarchy[this.role];
  }
}
```

### Polymorphic Relationships Pattern

```typescript
// entities/comment.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { AuditSqliteEntity } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './user.entity';

export enum CommentableType {
  POST = 'post',
  PROJECT = 'project',
  TASK = 'task',
  DOCUMENT = 'document',
}

@Entity('comment')
@Index(['commentableType', 'commentableId']) // For polymorphic queries
@Index(['authorId', 'dateCreated']) // For user activity
export class CommentEntity extends AuditSqliteEntity {
  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  commentableType!: CommentableType;

  @Column({ type: 'varchar', length: 255 })
  commentableId!: string;

  @Column({ type: 'varchar', length: 255 })
  authorId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  parentId?: string;

  @Column({ type: 'boolean', default: false })
  isEdited?: boolean;

  @Column({ type: 'datetime', nullable: true })
  editedAt?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    mentions?: string[];
    attachments?: string[];
    reactions?: Record<string, number>;
  };

  @ManyToOne(() => UserEntity)
  author!: UserEntity;

  @ManyToOne(() => CommentEntity, { nullable: true })
  parent?: CommentEntity;

  // Business Methods
  isReply(): boolean {
    return !!this.parentId;
  }

  addReaction(emoji: string): void {
    if (!this.metadata) this.metadata = {};
    if (!this.metadata.reactions) this.metadata.reactions = {};
    
    this.metadata.reactions[emoji] = (this.metadata.reactions[emoji] || 0) + 1;
  }

  removeReaction(emoji: string): void {
    if (!this.metadata?.reactions?.[emoji]) return;
    
    this.metadata.reactions[emoji]--;
    if (this.metadata.reactions[emoji] <= 0) {
      delete this.metadata.reactions[emoji];
    }
  }
}
```

### Self-Referencing Hierarchical Entities

```typescript
// entities/category.entity.ts
import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { AuditSqliteEntity } from '@concepta/nestjs-typeorm-ext';

@Entity('category')
@Index(['parentId', 'active']) // For hierarchy queries
@Index(['path']) // For path-based queries
@Index(['level', 'sortOrder']) // For tree traversal
export class CategoryEntity extends AuditSqliteEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  parentId?: string;

  @Column({ type: 'text', nullable: true })
  path?: string; // Materialized path: /1/2/3/

  @Column({ type: 'integer', default: 0 })
  level!: number; // Depth in hierarchy

  @Column({ type: 'integer', default: 0 })
  sortOrder?: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    icon?: string;
    color?: string;
    isLeaf?: boolean;
    childCount?: number;
  };

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];

  // Business Methods
  getAncestors(): string[] {
    if (!this.path) return [];
    return this.path.split('/').filter(id => id && id !== this.id);
  }

  isAncestorOf(category: CategoryEntity): boolean {
    return category.path?.startsWith(this.path + this.id + '/') ?? false;
  }

  isDescendantOf(category: CategoryEntity): boolean {
    return this.path?.includes('/' + category.id + '/') ?? false;
  }

  updatePath(): void {
    if (this.parent?.path) {
      this.path = this.parent.path + this.parent.id + '/';
      this.level = this.parent.level + 1;
    } else {
      this.path = '/';
      this.level = 0;
    }
  }
}
```

## Database View Patterns for Complex Queries

### User Summary View with Aggregated Data

```typescript
// entities/user-summary-view.entity.ts
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'user_summary_view',
  expression: `
    SELECT 
      u.id,
      u.username,
      u.email,
      u.first_name,
      u.last_name,
      u.is_verified,
      u.last_login_at,
      u.date_created,
      u.date_updated,
      
      -- Role aggregations
      array_agg(DISTINCT r.name ORDER BY r.name) FILTER (WHERE r.name IS NOT NULL) as role_names,
      array_agg(DISTINCT r.id ORDER BY r.id) FILTER (WHERE r.id IS NOT NULL) as role_ids,
      COUNT(DISTINCT ur.id) as role_count,
      
      -- Activity metrics
      COUNT(DISTINCT c.id) as comment_count,
      COUNT(DISTINCT pm.id) as project_count,
      MAX(c.date_created) as last_comment_at,
      
      -- Security metrics
      COUNT(DISTINCT uo.id) FILTER (WHERE uo.date_created > NOW() - INTERVAL '30 days') as recent_otp_count,
      COUNT(DISTINCT f.id) as federated_account_count,
      
      -- Status calculations
      CASE 
        WHEN u.last_login_at > NOW() - INTERVAL '7 days' THEN 'active'
        WHEN u.last_login_at > NOW() - INTERVAL '30 days' THEN 'inactive'
        ELSE 'dormant'
      END as activity_status
      
    FROM user u
    LEFT JOIN user_role ur ON u.id = ur.user_id AND ur.active = true
    LEFT JOIN role r ON ur.role_id = r.id AND r.active = true
    LEFT JOIN comment c ON u.id = c.author_id
    LEFT JOIN project_member pm ON u.id = pm.user_id AND pm.status = 'active'
    LEFT JOIN user_otp uo ON u.id = uo.assignee_id
    LEFT JOIN federated f ON u.id = f.assignee_id AND f.is_active = true
    
    WHERE u.active = true
    GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, 
             u.is_verified, u.last_login_at, u.date_created, u.date_updated
  `,
})
export class UserSummaryViewEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  username!: string;

  @ViewColumn()
  email!: string;

  @ViewColumn({ name: 'first_name' })
  firstName?: string;

  @ViewColumn({ name: 'last_name' })
  lastName?: string;

  @ViewColumn({ name: 'is_verified' })
  isVerified!: boolean;

  @ViewColumn({ name: 'last_login_at' })
  lastLoginAt?: Date;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: Date;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated!: Date;

  // Aggregated role data
  @ViewColumn({ name: 'role_names' })
  roleNames!: string[];

  @ViewColumn({ name: 'role_ids' })
  roleIds!: string[];

  @ViewColumn({ name: 'role_count' })
  roleCount!: number;

  // Activity metrics
  @ViewColumn({ name: 'comment_count' })
  commentCount!: number;

  @ViewColumn({ name: 'project_count' })
  projectCount!: number;

  @ViewColumn({ name: 'last_comment_at' })
  lastCommentAt?: Date;

  // Security metrics
  @ViewColumn({ name: 'recent_otp_count' })
  recentOtpCount!: number;

  @ViewColumn({ name: 'federated_account_count' })
  federatedAccountCount!: number;

  // Computed status
  @ViewColumn({ name: 'activity_status' })
  activityStatus!: 'active' | 'inactive' | 'dormant';

  // Computed methods
  getFullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }

  hasMultipleRoles(): boolean {
    return this.roleCount > 1;
  }

  isHighlyActive(): boolean {
    return this.activityStatus === 'active' && 
           this.commentCount > 10 && 
           this.projectCount > 2;
  }
}
```

### Project Analytics View

```typescript
// entities/project-analytics-view.entity.ts
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'project_analytics_view',
  expression: `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.status,
      p.date_created,
      p.date_updated,
      
      -- Member metrics
      COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.status = 'active') as active_member_count,
      COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.role = 'owner') as owner_count,
      COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.role = 'admin') as admin_count,
      
      -- Activity metrics
      COUNT(DISTINCT c.id) as total_comments,
      COUNT(DISTINCT c.id) FILTER (WHERE c.date_created > NOW() - INTERVAL '7 days') as recent_comments,
      COUNT(DISTINCT c.author_id) as unique_commenters,
      
      -- Time metrics
      MAX(c.date_created) as last_activity_at,
      MIN(pm.joined_at) as first_member_joined_at,
      
      -- Health indicators
      CASE 
        WHEN MAX(c.date_created) > NOW() - INTERVAL '3 days' THEN 'very_active'
        WHEN MAX(c.date_created) > NOW() - INTERVAL '7 days' THEN 'active'
        WHEN MAX(c.date_created) > NOW() - INTERVAL '30 days' THEN 'moderate'
        ELSE 'inactive'
      END as activity_level,
      
      -- Engagement ratio
      CASE 
        WHEN COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.status = 'active') > 0 
        THEN ROUND(
          COUNT(DISTINCT c.author_id)::numeric / 
          COUNT(DISTINCT pm.user_id) FILTER (WHERE pm.status = 'active')::numeric, 
          2
        )
        ELSE 0
      END as engagement_ratio
      
    FROM project p
    LEFT JOIN project_member pm ON p.id = pm.project_id
    LEFT JOIN comment c ON p.id = c.commentable_id AND c.commentable_type = 'project'
    
    WHERE p.active = true
    GROUP BY p.id, p.name, p.description, p.status, p.date_created, p.date_updated
  `,
})
export class ProjectAnalyticsViewEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  description?: string;

  @ViewColumn()
  status!: string;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: Date;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated!: Date;

  // Member metrics
  @ViewColumn({ name: 'active_member_count' })
  activeMemberCount!: number;

  @ViewColumn({ name: 'owner_count' })
  ownerCount!: number;

  @ViewColumn({ name: 'admin_count' })
  adminCount!: number;

  // Activity metrics
  @ViewColumn({ name: 'total_comments' })
  totalComments!: number;

  @ViewColumn({ name: 'recent_comments' })
  recentComments!: number;

  @ViewColumn({ name: 'unique_commenters' })
  uniqueCommenters!: number;

  // Time metrics
  @ViewColumn({ name: 'last_activity_at' })
  lastActivityAt?: Date;

  @ViewColumn({ name: 'first_member_joined_at' })
  firstMemberJoinedAt?: Date;

  // Health indicators
  @ViewColumn({ name: 'activity_level' })
  activityLevel!: 'very_active' | 'active' | 'moderate' | 'inactive';

  @ViewColumn({ name: 'engagement_ratio' })
  engagementRatio!: number;

  // Business methods
  isHealthy(): boolean {
    return this.activeMemberCount >= 2 && 
           this.engagementRatio >= 0.5 &&
           ['very_active', 'active'].includes(this.activityLevel);
  }

  needsAttention(): boolean {
    return this.activeMemberCount === 1 || 
           this.engagementRatio < 0.3 ||
           this.activityLevel === 'inactive';
  }

  getDaysFromLastActivity(): number {
    if (!this.lastActivityAt) return Infinity;
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.lastActivityAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### View Adapter Pattern

```typescript
// adapters/user-summary-view.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudAdapter } from '@concepta/nestjs-crud';
import { UserSummaryViewEntity } from '../entities/user-summary-view.entity';

@Injectable()
export class UserSummaryViewAdapter extends TypeOrmCrudAdapter<UserSummaryViewEntity> {
  constructor(
    @InjectRepository(UserSummaryViewEntity)
    private readonly repository: Repository<UserSummaryViewEntity>,
  ) {
    super(repository);
  }

  // Custom query methods for the view
  async findActiveUsers(): Promise<UserSummaryViewEntity[]> {
    return this.repository.find({
      where: { activityStatus: 'active' },
      order: { lastLoginAt: 'DESC' },
    });
  }

  async findUsersWithMultipleRoles(): Promise<UserSummaryViewEntity[]> {
    return this.repository
      .createQueryBuilder('view')
      .where('view.roleCount > :count', { count: 1 })
      .orderBy('view.roleCount', 'DESC')
      .getMany();
  }

  async findHighEngagementUsers(limit: number = 20): Promise<UserSummaryViewEntity[]> {
    return this.repository
      .createQueryBuilder('view')
      .where('view.commentCount > :comments', { comments: 10 })
      .andWhere('view.projectCount > :projects', { projects: 2 })
      .orderBy('(view.commentCount + view.projectCount)', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getUserActivitySummary(): Promise<{
    total: number;
    active: number;
    inactive: number;
    dormant: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('view')
      .select('view.activityStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('view.activityStatus')
      .getRawMany();

    const summary = { total: 0, active: 0, inactive: 0, dormant: 0 };
    
    result.forEach(row => {
      summary[row.status] = parseInt(row.count);
      summary.total += parseInt(row.count);
    });

    return summary;
  }
}
```

## Entity Inheritance Patterns

### Abstract Base Entity Pattern

```typescript
// entities/base/auditable-entity.base.ts
import { Column, Index } from 'typeorm';
import { AuditSqliteEntity } from '@concepta/nestjs-typeorm-ext';

export abstract class AuditableEntityBase extends AuditSqliteEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index() // For filtering by creator
  createdBy?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index() // For filtering by updater
  updatedBy?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  createdFromIp?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  updatedFromIp?: string;

  @Column({ type: 'json', nullable: true })
  auditMetadata?: {
    userAgent?: string;
    sessionId?: string;
    correlationId?: string;
    source?: string;
  };

  // Business methods
  setAuditInfo(userId: string, ipAddress?: string, metadata?: Record<string, any>): void {
    if (!this.dateCreated) {
      this.createdBy = userId;
      this.createdFromIp = ipAddress;
    } else {
      this.updatedBy = userId;
      this.updatedFromIp = ipAddress;
    }

    if (metadata) {
      this.auditMetadata = { ...this.auditMetadata, ...metadata };
    }
  }

  getLastModifiedBy(): string | undefined {
    return this.updatedBy || this.createdBy;
  }

  hasBeenModifiedBy(userId: string): boolean {
    return this.createdBy === userId || this.updatedBy === userId;
  }
}
```

### Taggable Mixin Pattern

```typescript
// entities/mixins/taggable.mixin.ts
import { Column, ManyToMany, JoinTable } from 'typeorm';
import { TagEntity } from '../tag.entity';

export function TaggableMixin<T extends new (...args: any[]) => {}>(Base: T) {
  class TaggableClass extends Base {
    @Column({ type: 'simple-array', nullable: true })
    quickTags?: string[];

    @ManyToMany(() => TagEntity)
    @JoinTable({
      name: 'entity_tags',
      joinColumn: { name: 'entityId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
    })
    tags?: TagEntity[];

    // Tag management methods
    addQuickTag(tag: string): void {
      if (!this.quickTags) this.quickTags = [];
      if (!this.quickTags.includes(tag)) {
        this.quickTags.push(tag);
      }
    }

    removeQuickTag(tag: string): void {
      if (!this.quickTags) return;
      this.quickTags = this.quickTags.filter(t => t !== tag);
    }

    hasTag(tagName: string): boolean {
      const hasQuickTag = this.quickTags?.includes(tagName) ?? false;
      const hasStructuredTag = this.tags?.some(tag => tag.name === tagName) ?? false;
      return hasQuickTag || hasStructuredTag;
    }

    getAllTagNames(): string[] {
      const quickTags = this.quickTags || [];
      const structuredTags = this.tags?.map(tag => tag.name) || [];
      return [...new Set([...quickTags, ...structuredTags])];
    }
  }

  return TaggableClass;
}
```

### Versioned Entity Pattern

```typescript
// entities/mixins/versioned.mixin.ts
import { Column, Index } from 'typeorm';

export function VersionedMixin<T extends new (...args: any[]) => {}>(Base: T) {
  class VersionedClass extends Base {
    @Column({ type: 'integer', default: 1 })
    @Index() // For version queries
    versionNumber!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    versionLabel?: string;

    @Column({ type: 'text', nullable: true })
    changeNotes?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    versionCreatedBy?: string;

    @Column({ type: 'datetime', nullable: true })
    versionCreatedAt?: Date;

    @Column({ type: 'boolean', default: true })
    @Index() // For finding current versions
    isCurrentVersion!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index() // For grouping versions
    originalEntityId?: string;

    // Version management methods
    createNewVersion(userId: string, notes?: string, label?: string): Partial<VersionedClass> {
      return {
        ...this,
        id: undefined, // Will get new ID
        versionNumber: this.versionNumber + 1,
        versionLabel: label,
        changeNotes: notes,
        versionCreatedBy: userId,
        versionCreatedAt: new Date(),
        isCurrentVersion: true,
        originalEntityId: this.originalEntityId || this.id,
      } as Partial<VersionedClass>;
    }

    markAsOldVersion(): void {
      this.isCurrentVersion = false;
    }

    isNewerThan(other: VersionedClass): boolean {
      return this.versionNumber > other.versionNumber;
    }

    getVersionHistory(): string {
      return `v${this.versionNumber}${this.versionLabel ? ` (${this.versionLabel})` : ''}`;
    }
  }

  return VersionedClass;
}
```

### Using Mixins in Entity Classes

```typescript
// entities/document.entity.ts
import { Entity, Column } from 'typeorm';
import { AuditableEntityBase } from './base/auditable-entity.base';
import { TaggableMixin } from './mixins/taggable.mixin';
import { VersionedMixin } from './mixins/versioned.mixin';

@Entity('document')
export class DocumentEntity extends VersionedMixin(TaggableMixin(AuditableEntityBase)) {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 100 })
  documentType!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authorId?: string;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ type: 'datetime', nullable: true })
  publishedAt?: Date;

  // Business methods combining all mixins
  publishVersion(userId: string, notes?: string): Partial<DocumentEntity> {
    const newVersion = this.createNewVersion(userId, notes, 'Published');
    return {
      ...newVersion,
      isPublished: true,
      publishedAt: new Date(),
    };
  }

  isDraft(): boolean {
    return !this.isPublished;
  }

  canBeEditedBy(userId: string): boolean {
    return this.authorId === userId || this.hasBeenModifiedBy(userId);
  }
}
```

## Advanced TypeORM Patterns for SDK Integration

### Custom Repository Pattern

```typescript
// repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

export interface UserSearchCriteria {
  name?: string;
  email?: string;
  roles?: string[];
  tags?: string[];
  isVerified?: boolean;
  activityStatus?: 'active' | 'inactive' | 'dormant';
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Advanced search with dynamic query building
   */
  async findBySearchCriteria(criteria: UserSearchCriteria): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryBuilder = this.createSearchQueryBuilder(criteria);
    
    // Apply pagination
    const { page = 1, limit = 20 } = criteria.pagination || {};
    const offset = (page - 1) * limit;
    
    queryBuilder.skip(offset).take(limit);
    
    // Get results and count
    const [users, total] = await queryBuilder.getManyAndCount();
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find users with their complete profile data
   */
  async findWithCompleteProfile(userId: string): Promise<UserEntity | null> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('user.federatedAccounts', 'federated')
      .leftJoinAndSelect('user.userOtps', 'otp', 'otp.active = :active', { active: true })
      .where('user.id = :userId', { userId })
      .getOne();
  }

  /**
   * Find users by role with activity metrics
   */
  async findByRoleWithActivity(roleName: string): Promise<any[]> {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'u.id',
        'u.username',
        'u.email',
        'u.firstName',
        'u.lastName',
        'u.lastLoginAt',
        'COUNT(DISTINCT c.id) as commentCount',
        'COUNT(DISTINCT pm.id) as projectCount',
        'MAX(c.dateCreated) as lastCommentAt',
      ])
      .from(UserEntity, 'u')
      .leftJoin('u.userRoles', 'ur')
      .leftJoin('ur.role', 'r')
      .leftJoin('comment', 'c', 'c.authorId = u.id')
      .leftJoin('project_member', 'pm', 'pm.userId = u.id AND pm.status = :status', { status: 'active' })
      .where('r.name = :roleName', { roleName })
      .andWhere('u.active = :active', { active: true })
      .groupBy('u.id, u.username, u.email, u.firstName, u.lastName, u.lastLoginAt')
      .orderBy('u.lastLoginAt', 'DESC')
      .getRawMany();
  }

  /**
   * Bulk update user preferences
   */
  async updatePreferences(updates: Array<{ userId: string; preferences: Record<string, any> }>): Promise<void> {
    await this.dataSource.transaction(async manager => {
      for (const update of updates) {
        await manager
          .createQueryBuilder()
          .update(UserEntity)
          .set({ 
            preferences: () => `JSON_SET(COALESCE(preferences, '{}'), ${
              Object.keys(update.preferences)
                .map(key => `'$.${key}', :${key}_${update.userId}`)
                .join(', ')
            })`
          })
          .where('id = :userId', { userId: update.userId })
          .setParameters(
            Object.fromEntries(
              Object.entries(update.preferences).map(([key, value]) => [
                `${key}_${update.userId}`,
                JSON.stringify(value)
              ])
            )
          )
          .execute();
      }
    });
  }

  private createSearchQueryBuilder(criteria: UserSearchCriteria): SelectQueryBuilder<UserEntity> {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role');

    // Text search
    if (criteria.name) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :name OR user.lastName LIKE :name OR CONCAT(user.firstName, " ", user.lastName) LIKE :name)',
        { name: `%${criteria.name}%` }
      );
    }

    if (criteria.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${criteria.email}%` });
    }

    // Role filtering
    if (criteria.roles && criteria.roles.length > 0) {
      queryBuilder.andWhere('role.name IN (:...roles)', { roles: criteria.roles });
    }

    // Tag filtering
    if (criteria.tags && criteria.tags.length > 0) {
      queryBuilder.andWhere(
        'EXISTS(SELECT 1 FROM JSON_TABLE(user.tags, "$[*]" COLUMNS(tag VARCHAR(255) PATH "$")) AS jt WHERE jt.tag IN (:...tags))',
        { tags: criteria.tags }
      );
    }

    // Verification status
    if (criteria.isVerified !== undefined) {
      queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified: criteria.isVerified });
    }

    // Activity status
    if (criteria.activityStatus) {
      switch (criteria.activityStatus) {
        case 'active':
          queryBuilder.andWhere('user.lastLoginAt > :activeDate', { 
            activeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          });
          break;
        case 'inactive':
          queryBuilder.andWhere('user.lastLoginAt BETWEEN :inactiveStart AND :inactiveEnd', {
            inactiveStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            inactiveEnd: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          });
          break;
        case 'dormant':
          queryBuilder.andWhere('(user.lastLoginAt IS NULL OR user.lastLoginAt < :dormantDate)', {
            dormantDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          });
          break;
      }
    }

    // Date range
    if (criteria.dateRange) {
      if (criteria.dateRange.from) {
        queryBuilder.andWhere('user.dateCreated >= :fromDate', { fromDate: criteria.dateRange.from });
      }
      if (criteria.dateRange.to) {
        queryBuilder.andWhere('user.dateCreated <= :toDate', { toDate: criteria.dateRange.to });
      }
    }

    // Default ordering
    queryBuilder.orderBy('user.dateCreated', 'DESC');

    return queryBuilder;
  }
}
```

### Advanced Model Service Pattern

```typescript
// services/advanced-user-model.service.ts
import { Injectable } from '@nestjs/common';
import { ModelService } from '@concepta/nestjs-typeorm-ext';
import { InjectDynamicRepository } from '@concepta/nestjs-typeorm-ext';
import { RepositoryInterface } from '@concepta/nestjs-common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserEntity } from '../entities/user.entity';
import { UserEntityInterface } from '../interfaces/user-entity.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AdvancedUserModelService extends ModelService<
  UserEntityInterface,
  UserCreatableInterface,
  UserUpdatableInterface
> {
  constructor(
    @InjectDynamicRepository('user')
    repo: RepositoryInterface<UserEntityInterface>,
    private readonly userRepository: UserRepository,
  ) {
    super(repo);
  }

  /**
   * Create user with automatic profile completion scoring
   */
  async createWithProfileScore(dto: UserCreatableInterface): Promise<UserEntityInterface> {
    const user = await this.create(dto);
    await this.updateProfileCompletionScore(user.id);
    return this.byId(user.id);
  }

  /**
   * Update user and recalculate profile score
   */
  async updateWithProfileScore(
    id: string, 
    updates: QueryDeepPartialEntity<UserEntityInterface>
  ): Promise<UserEntityInterface> {
    await this.update(id, updates);
    await this.updateProfileCompletionScore(id);
    return this.byId(id);
  }

  /**
   * Find users with similar profiles
   */
  async findSimilarUsers(userId: string, limit: number = 5): Promise<UserEntityInterface[]> {
    const user = await this.byId(userId);
    if (!user) return [];

    const queryBuilder = this.repo
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('user.active = :active', { active: true });

    let similarityScore = '0';

    // Add similarity scoring based on available fields
    if (user.firstName) {
      similarityScore += ' + CASE WHEN user.firstName = :firstName THEN 2 ELSE 0 END';
      queryBuilder.setParameter('firstName', user.firstName);
    }

    if (user.tags && user.tags.length > 0) {
      similarityScore += ' + CASE WHEN JSON_CONTAINS(user.tags, :userTags) THEN 3 ELSE 0 END';
      queryBuilder.setParameter('userTags', JSON.stringify(user.tags));
    }

    if (user.timezone) {
      similarityScore += ' + CASE WHEN user.timezone = :timezone THEN 1 ELSE 0 END';
      queryBuilder.setParameter('timezone', user.timezone);
    }

    return queryBuilder
      .addSelect(`(${similarityScore})`, 'similarity_score')
      .having('similarity_score > 0')
      .orderBy('similarity_score', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Bulk operations for user management
   */
  async bulkUpdateTags(updates: Array<{ userId: string; tags: string[] }>): Promise<void> {
    const updatePromises = updates.map(update => 
      this.update(update.userId, { tags: update.tags })
    );
    
    await Promise.all(updatePromises);
  }

  /**
   * Get user activity statistics
   */
  async getUserActivityStats(userId: string): Promise<{
    profileCompletionScore: number;
    loginFrequency: 'daily' | 'weekly' | 'monthly' | 'rare';
    engagementLevel: 'high' | 'medium' | 'low';
    socialConnections: number;
  }> {
    const user = await this.byId(userId);
    if (!user) throw new Error('User not found');

    // Calculate profile completion
    const profileScore = this.calculateProfileCompletionScore(user);

    // Determine login frequency
    const loginFrequency = this.calculateLoginFrequency(user.lastLoginAt);

    // Get social connections (federated accounts + verified status)
    const socialConnections = (user.federatedAccounts?.length || 0) + (user.isVerified ? 1 : 0);

    // Determine engagement level based on various factors
    const engagementLevel = this.calculateEngagementLevel(profileScore, socialConnections, loginFrequency);

    return {
      profileCompletionScore: profileScore,
      loginFrequency,
      engagementLevel,
      socialConnections,
    };
  }

  /**
   * Advanced user search with caching
   */
  async searchUsers(criteria: UserSearchCriteria): Promise<{
    users: UserEntityInterface[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.userRepository.findBySearchCriteria(criteria);
  }

  private async updateProfileCompletionScore(userId: string): Promise<void> {
    const user = await this.byId(userId);
    if (!user) return;

    const score = this.calculateProfileCompletionScore(user);
    
    await this.update(userId, {
      preferences: {
        ...user.preferences,
        profileCompletionScore: score,
      },
    });
  }

  private calculateProfileCompletionScore(user: UserEntityInterface): number {
    let score = 0;
    const maxScore = 100;

    // Basic info (40 points)
    if (user.firstName) score += 10;
    if (user.lastName) score += 10;
    if (user.phoneNumber) score += 10;
    if (user.email) score += 10;

    // Verification (20 points)
    if (user.isVerified) score += 20;

    // Additional info (20 points)
    if (user.tags && user.tags.length > 0) score += 10;
    if (user.timezone) score += 5;
    if (user.preferences && Object.keys(user.preferences).length > 0) score += 5;

    // Social connections (20 points)
    if (user.federatedAccounts && user.federatedAccounts.length > 0) score += 10;
    if (user.lastLoginAt) score += 10;

    return Math.min(score, maxScore);
  }

  private calculateLoginFrequency(lastLoginAt?: Date): 'daily' | 'weekly' | 'monthly' | 'rare' {
    if (!lastLoginAt) return 'rare';

    const now = new Date();
    const daysSinceLogin = Math.floor((now.getTime() - lastLoginAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLogin <= 1) return 'daily';
    if (daysSinceLogin <= 7) return 'weekly';
    if (daysSinceLogin <= 30) return 'monthly';
    return 'rare';
  }

  private calculateEngagementLevel(
    profileScore: number,
    socialConnections: number,
    loginFrequency: string
  ): 'high' | 'medium' | 'low' {
    let engagementPoints = 0;

    // Profile completion contribution
    if (profileScore >= 80) engagementPoints += 3;
    else if (profileScore >= 60) engagementPoints += 2;
    else if (profileScore >= 40) engagementPoints += 1;

    // Social connections contribution
    if (socialConnections >= 3) engagementPoints += 3;
    else if (socialConnections >= 2) engagementPoints += 2;
    else if (socialConnections >= 1) engagementPoints += 1;

    // Login frequency contribution
    switch (loginFrequency) {
      case 'daily': engagementPoints += 3; break;
      case 'weekly': engagementPoints += 2; break;
      case 'monthly': engagementPoints += 1; break;
      default: break;
    }

    if (engagementPoints >= 7) return 'high';
    if (engagementPoints >= 4) return 'medium';
    return 'low';
  }
}
```

## Performance Optimization Techniques for Entities

### Database Indexing Strategies

```typescript
// entities/optimized-user.entity.ts
import { Entity, Column, OneToMany, Index, Unique } from 'typeorm';
import { UserSqliteEntity } from '@concepta/nestjs-typeorm-ext';

@Entity('user')
// Composite indexes for common query patterns
@Index(['email', 'active']) // Login queries
@Index(['username', 'active']) // Username lookups
@Index(['isVerified', 'active', 'dateCreated']) // Admin filtering
@Index(['lastLoginAt', 'active']) // Activity analysis
@Index(['firstName', 'lastName']) // Name searches
// Unique constraints
@Unique(['email'])
@Unique(['username'])
@Unique(['phoneNumber'])
export class OptimizedUserEntity extends UserSqliteEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index() // Individual index for name searches
  firstName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index() // Individual index for name searches
  lastName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index() // For phone number searches
  phoneNumber?: string;

  @Column({ type: 'boolean', default: false })
  @Index() // For verification filtering
  isVerified?: boolean;

  @Column({ type: 'datetime', nullable: true })
  @Index() // For activity analysis
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Index() // For timezone-based queries
  timezone?: string;

  // Denormalized fields for performance
  @Column({ type: 'varchar', length: 101, nullable: true })
  @Index() // Full name for searching
  fullName?: string;

  @Column({ type: 'integer', default: 0 })
  @Index() // For quick profile scoring
  profileScore?: number;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  @Index() // For user status filtering
  activityStatus?: 'active' | 'inactive' | 'dormant';

  // Update full name when first or last name changes
  updateFullName(): void {
    this.fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
  }
}
```

### Lazy Loading and Eager Loading Strategies

```typescript
// services/performance-optimized-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class PerformanceOptimizedUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get user with minimal data for lists
   */
  async getUsersForListing(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ users: Partial<UserEntity>[]; total: number }> {
    const { page = 1, limit = 20, search } = options;
    
    let queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.isVerified',
        'user.lastLoginAt',
        'user.activityStatus',
      ])
      .where('user.active = :active', { active: true });

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.fullName LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder = queryBuilder
      .orderBy('user.lastLoginAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  }

  /**
   * Get single user with selective loading based on needs
   */
  async getUserById(
    id: string,
    options: {
      includeRoles?: boolean;
      includeFederatedAccounts?: boolean;
      includeOtps?: boolean;
      includeMetadata?: boolean;
    } = {}
  ): Promise<UserEntity | null> {
    const relations: string[] = [];
    
    if (options.includeRoles) {
      relations.push('userRoles', 'userRoles.role');
    }
    
    if (options.includeFederatedAccounts) {
      relations.push('federatedAccounts');
    }
    
    if (options.includeOtps) {
      relations.push('userOtps');
    }

    const findOptions: FindManyOptions<UserEntity> = {
      where: { id, active: true },
      relations,
    };

    // Conditionally select fields based on metadata needs
    if (!options.includeMetadata) {
      findOptions.select = [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'isVerified',
        'lastLoginAt',
        'dateCreated',
        'dateUpdated',
      ];
    }

    return this.userRepository.findOne(findOptions);
  }

  /**
   * Batch load users to avoid N+1 queries
   */
  async getUsersByIds(
    ids: string[],
    includeRoles: boolean = false
  ): Promise<UserEntity[]> {
    if (ids.length === 0) return [];

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids })
      .andWhere('user.active = :active', { active: true });

    if (includeRoles) {
      queryBuilder
        .leftJoinAndSelect('user.userRoles', 'userRole')
        .leftJoinAndSelect('userRole.role', 'role');
    }

    return queryBuilder.getMany();
  }

  /**
   * Count operations optimized with specific indexes
   */
  async getUserCounts(): Promise<{
    total: number;
    verified: number;
    active: number;
    recentlyActive: number;
  }> {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);

    const [total, verified, active, recentlyActive] = await Promise.all([
      this.userRepository.count({ where: { active: true } }),
      this.userRepository.count({ where: { active: true, isVerified: true } }),
      this.userRepository.count({ where: { activityStatus: 'active' } }),
      this.userRepository.count({
        where: {
          active: true,
          lastLoginAt: new Date(recentDate),
        },
      }),
    ]);

    return { total, verified, active, recentlyActive };
  }

  /**
   * Paginated search with cursor-based pagination for better performance
   */
  async getUsersWithCursorPagination(options: {
    limit?: number;
    cursor?: string; // User ID to start from
    search?: string;
  } = {}): Promise<{
    users: UserEntity[];
    nextCursor?: string;
    hasMore: boolean;
  }> {
    const { limit = 20, cursor, search } = options;
    
    let queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.fullName',
        'user.isVerified',
        'user.lastLoginAt',
      ])
      .where('user.active = :active', { active: true });

    // Cursor-based pagination
    if (cursor) {
      queryBuilder = queryBuilder.andWhere('user.id > :cursor', { cursor });
    }

    // Search functionality
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.fullName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder = queryBuilder
      .orderBy('user.id', 'ASC')
      .take(limit + 1); // Take one extra to check if there are more

    const users = await queryBuilder.getMany();
    const hasMore = users.length > limit;
    
    if (hasMore) {
      users.pop(); // Remove the extra record
    }

    const nextCursor = hasMore && users.length > 0 ? users[users.length - 1].id : undefined;

    return {
      users,
      nextCursor,
      hasMore,
    };
  }
}
```

### Caching Strategies

```typescript
// services/cached-user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserEntity } from '../entities/user.entity';
import { PerformanceOptimizedUserService } from './performance-optimized-user.service';

@Injectable()
export class CachedUserService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly USER_CACHE_PREFIX = 'user:';
  private readonly USER_LIST_CACHE_PREFIX = 'user-list:';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: PerformanceOptimizedUserService,
  ) {}

  /**
   * Get user with caching
   */
  async getCachedUser(id: string): Promise<UserEntity | null> {
    const cacheKey = `${this.USER_CACHE_PREFIX}${id}`;
    
    // Try to get from cache first
    let user = await this.cacheManager.get<UserEntity>(cacheKey);
    
    if (!user) {
      // Not in cache, fetch from database
      user = await this.userService.getUserById(id);
      
      if (user) {
        // Cache the result
        await this.cacheManager.set(cacheKey, user, this.CACHE_TTL);
      }
    }
    
    return user;
  }

  /**
   * Get user list with caching
   */
  async getCachedUserList(options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ users: Partial<UserEntity>[]; total: number }> {
    const cacheKey = `${this.USER_LIST_CACHE_PREFIX}${JSON.stringify(options)}`;
    
    // Try to get from cache first
    let result = await this.cacheManager.get<{ users: Partial<UserEntity>[]; total: number }>(cacheKey);
    
    if (!result) {
      // Not in cache, fetch from database
      result = await this.userService.getUsersForListing(options);
      
      // Cache the result for a shorter time for lists
      await this.cacheManager.set(cacheKey, result, this.CACHE_TTL / 2);
    }
    
    return result;
  }

  /**
   * Update user and invalidate related cache entries
   */
  async updateUserWithCacheInvalidation(id: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    // Update the user
    const updatedUser = await this.userService.updateUser(id, updates);
    
    // Invalidate cache entries
    await this.invalidateUserCache(id);
    
    return updatedUser;
  }

  /**
   * Batch cache warm-up for frequently accessed users
   */
  async warmUpUserCache(userIds: string[]): Promise<void> {
    const users = await this.userService.getUsersByIds(userIds);
    
    const cachePromises = users.map(user => 
      this.cacheManager.set(
        `${this.USER_CACHE_PREFIX}${user.id}`,
        user,
        this.CACHE_TTL
      )
    );
    
    await Promise.all(cachePromises);
  }

  /**
   * Invalidate all cache entries for a user
   */
  private async invalidateUserCache(userId: string): Promise<void> {
    const userCacheKey = `${this.USER_CACHE_PREFIX}${userId}`;
    
    // Remove individual user cache
    await this.cacheManager.del(userCacheKey);
    
    // For simplicity, we're clearing list caches
    // In production, you might want more sophisticated cache invalidation
    const listKeys = await this.cacheManager.store.keys(`${this.USER_LIST_CACHE_PREFIX}*`);
    if (listKeys && listKeys.length > 0) {
      await Promise.all(listKeys.map(key => this.cacheManager.del(key)));
    }
  }
}
```

### Query Optimization Patterns

```typescript
// services/query-optimized.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class QueryOptimizedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Optimized count query without loading data
   */
  async getOptimizedUserCounts(): Promise<Record<string, number>> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(*) as total',
        'COUNT(CASE WHEN is_verified = 1 THEN 1 END) as verified',
        'COUNT(CASE WHEN activity_status = "active" THEN 1 END) as active',
        'COUNT(CASE WHEN last_login_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as recently_active',
      ])
      .from(UserEntity, 'user')
      .where('active = 1')
      .getRawOne();

    return {
      total: parseInt(result.total),
      verified: parseInt(result.verified),
      active: parseInt(result.active),
      recentlyActive: parseInt(result.recently_active),
    };
  }

  /**
   * Batch operations for better performance
   */
  async batchUpdateUserActivity(): Promise<void> {
    // Update activity status based on last login
    await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        activityStatus: () => `
          CASE 
            WHEN last_login_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'active'
            WHEN last_login_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'inactive'
            ELSE 'dormant'
          END
        `
      })
      .where('active = :active', { active: true })
      .execute();
  }

  /**
   * Efficient aggregation queries
   */
  async getUserStatsByRole(): Promise<Array<{
    roleName: string;
    userCount: number;
    verifiedCount: number;
    activeCount: number;
  }>> {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'r.name as roleName',
        'COUNT(DISTINCT u.id) as userCount',
        'COUNT(DISTINCT CASE WHEN u.is_verified = 1 THEN u.id END) as verifiedCount',
        'COUNT(DISTINCT CASE WHEN u.activity_status = "active" THEN u.id END) as activeCount',
      ])
      .from('role', 'r')
      .leftJoin('user_role', 'ur', 'r.id = ur.role_id AND ur.active = 1')
      .leftJoin('user', 'u', 'ur.user_id = u.id AND u.active = 1')
      .where('r.active = 1')
      .groupBy('r.id, r.name')
      .orderBy('userCount', 'DESC')
      .getRawMany();
  }

  /**
   * Efficient search with full-text search capabilities
   */
  async searchUsersOptimized(searchTerm: string, limit: number = 20): Promise<UserEntity[]> {
    // Using MATCH AGAINST for full-text search (MySQL example)
    return this.userRepository
      .createQueryBuilder('user')
      .where('MATCH(full_name, email, username) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)', {
        searchTerm,
      })
      .orWhere('full_name LIKE :likeTerm', { likeTerm: `%${searchTerm}%` })
      .orderBy('MATCH(full_name, email, username) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)', 'DESC')
      .limit(limit)
      .getMany();
  }
}
```

This comprehensive guide covers advanced entity patterns, complex relationships, performance optimization techniques, and best practices for building enterprise-level applications with the Rockets SDK. These patterns provide a solid foundation for handling sophisticated business requirements while maintaining code quality and performance.