import { oO } from '@zmotivat0r/o0';
import { plainToClass } from 'class-transformer';
import {
  Brackets,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
  DataSourceOptions,
  OrderByCondition,
  WhereExpressionBuilder,
} from 'typeorm';

import {
  BadRequestException,
  NotFoundException,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import {
  isNil,
  isObject,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { CrudAdapter, CrudRequestInterface, CrudResponsePaginatedInterface, CrudCreateManyInterface } from '@concepta/nestjs-crud';
import { CrudEntityColumn } from '@concepta/nestjs-crud/dist/crud.types';
import { CrudRequestOptionsInterface } from '@concepta/nestjs-crud/dist/crud/interfaces/crud-request-options.interface';
import { CrudQueryOptionsInterface } from '@concepta/nestjs-crud/dist/interfaces/crud-query-options.interface';
import { CrudRequestParsedParamsInterface } from '@concepta/nestjs-crud/dist/request/interfaces/crud-request-parsed-params.interface';
import { QueryFilter, SCondition, SConditionKey, ComparisonOperator, QuerySort } from '@concepta/nestjs-crud/dist/request/types/crud-request-query.types';

export class TokenCrudAdapter<
  Entity extends PlainLiteralObject,
> extends CrudAdapter<Entity> {
  protected dbName: DataSourceOptions['type'];

  protected entityColumns: CrudEntityColumn<Entity>[] = [];

  protected entityPrimaryColumns: CrudEntityColumn<Entity>[] = [];

  protected entityHasDeleteColumn = false;

  protected entityColumnsHash: Record<string, unknown> = {};

  protected sqlInjectionRegEx: RegExp[] = [
    /(%27)|(\')|(--)|(%23)|(#)/gi,
    /((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/gi,
    /w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/gi,
    /((%27)|(\'))union/gi,
  ];

  constructor(protected repo: Repository<Entity>) {
    super();

    this.dbName = this.repo.metadata.connection.options.type;
    this.onInitMapEntityColumns();
  }

  public entityName(): string {
    return this.repo.metadata.name;
  }

  public entityType(): Type<Entity> {
    return this.repo.target as Type<Entity>;
  }

  protected get alias(): string {
    return this.repo.metadata.targetName;
  }

  /**
   * Get many
   *
   * @param req - The CRUD request interface.
   */
  public async getMany(
    req: CrudRequestInterface<Entity>,
  ): Promise<CrudResponsePaginatedInterface<Entity> | Entity[]> {
    throw new Error('Not implemented');
  }

  /**
   * Get one
   *
   * @param req - The CRUD request interface.
   */
  public async getOne(req: CrudRequestInterface<Entity>): Promise<Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Create one
   *
   * @param req - The CRUD request interface.
   * @param dto - The DTO containing the entity data to create.
   */
  public async createOne(
    req: CrudRequestInterface<Entity>,
    dto: Entity | Partial<Entity>,
  ): Promise<Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Create many entities.
   *
   * @param req - The CRUD request interface.
   * @param dto - The DTO containing the bulk array of entities to create.
   * @returns A promise resolving to an array of created entities.
   */
  public async createMany(
    req: CrudRequestInterface<Entity>,
    dto: CrudCreateManyInterface<Entity | Partial<Entity>>,
  ): Promise<Entity[]> {
    throw new Error('Not implemented');
  }

  /**
   * Update one entity.
   *
   * @param req - The CRUD request interface.
   * @param dto - The DTO containing the updated entity data.
   * @returns A promise resolving to the updated entity.
   */
  public async updateOne(
    req: CrudRequestInterface<Entity>,
    dto: Entity | Partial<Entity>,
  ): Promise<Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Recover one soft-deleted entity.
   *
   * @param req - The CRUD request interface.
   * @returns A promise resolving to the recovered entity.
   */
  public async recoverOne(req: CrudRequestInterface<Entity>): Promise<Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Replace one entity.
   *
   * @param req - The CRUD request interface.
   * @param dto - The DTO containing the replacement entity data.
   * @returns A promise resolving to the replaced entity.
   */
  public async replaceOne(
    req: CrudRequestInterface<Entity>,
    dto: Entity | Partial<Entity>,
  ): Promise<Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Delete one entity.
   *
   * @param req - The CRUD request interface.
   * @returns A promise resolving to the deleted entity or void.
   */
  public async deleteOne(
    req: CrudRequestInterface<Entity>,
  ): Promise<void | Entity> {
    throw new Error('Not implemented');
  }

  /**
   * Create a TypeORM QueryBuilder for the entity.
   *
   * @param parsed - The parsed request parameters.
   * @param options - CRUD request options.
   * @param many - Whether to query for many entities (default: true).
   * @param withDeleted - Whether to include soft-deleted entities (default: false).
   * @returns A promise resolving to a SelectQueryBuilder instance.
   */
  public async createBuilder(
    parsed: CrudRequestParsedParamsInterface<Entity>,
    options: CrudRequestOptionsInterface<Entity>,
    many = true,
    withDeleted = false,
  ): Promise<SelectQueryBuilder<Entity>> {
    throw new Error('Not implemented');
  }

  /**
   * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
   * helpful for overriding `CrudAdapter#getMany`
   *
   * @see getMany
   * @see SelectQueryBuilder#getMany
   * @see SelectQueryBuilder#getManyAndCount
   * @param builder - Select Query Builder for the entity
   * @param query - Parsed request parameters
   * @param options - CRUD request options
   */
  protected async doGetMany(
    builder: SelectQueryBuilder<Entity>,
    query: CrudRequestParsedParamsInterface<Entity>,
    options: CrudRequestOptionsInterface<Entity>,
  ): Promise<CrudResponsePaginatedInterface<Entity> | Entity[]> {
    throw new Error('Not implemented');
  }

  protected onInitMapEntityColumns() {
    throw new Error('Not implemented');
  }

  protected async getOneOrFail(
    req: CrudRequestInterface<Entity>,
    shallow = false,
    withDeleted = false,
  ): Promise<Entity> {
    throw new Error('Not implemented');
  }

  protected setAndWhere(
    cond: QueryFilter<Entity>,
    i: unknown,
    builder: WhereExpressionBuilder,
  ) {
    throw new Error('Not implemented');
  }

  protected setOrWhere(
    cond: QueryFilter<Entity>,
    i: unknown,
    builder: WhereExpressionBuilder,
  ) {
    throw new Error('Not implemented');
  }

  protected setSearchCondition(
    builder: WhereExpressionBuilder,
    search: SCondition<Entity>,
    condition: SConditionKey = '$and',
  ) {
    throw new Error('Not implemented');
  }

  protected builderAddBrackets(
    builder: WhereExpressionBuilder,
    condition: SConditionKey,
    brackets: Brackets,
  ) {
    throw new Error('Not implemented');
  }

  protected builderSetWhere(
    builder: WhereExpressionBuilder,
    condition: SConditionKey,
    field: string,
    value: unknown,
    operator: ComparisonOperator = '$eq',
  ) {
    throw new Error('Not implemented');
  }

  protected setSearchFieldObjectCondition(
    builder: WhereExpressionBuilder,
    condition: SConditionKey,
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: { [k: string]: any; $or?: any; $and?: any },
  ) {
    throw new Error('Not implemented');
  }

  protected getSelect(
    query: CrudRequestParsedParamsInterface<Entity>,
    options: CrudQueryOptionsInterface,
  ): CrudEntityColumn<Entity>[] {
    throw new Error('Not implemented');
  }

  protected getSort(
    query: CrudRequestParsedParamsInterface<Entity>,
    options: CrudQueryOptionsInterface,
  ): OrderByCondition {
    throw new Error('Not implemented');
  }

  protected getFieldWithAlias(field: string, sort = false) {
    throw new Error('Not implemented');
  }

  protected mapSort(sort: QuerySort<Entity>[]): OrderByCondition {
    throw new Error('Not implemented');
  }

  protected mapOperatorsToQuery(
    cond: QueryFilter<Entity>,
    param: string,
  ): { str: string; params: PlainLiteralObject } {
    throw new Error('Not implemented');
  }

  private checkSqlInjection(field: string): string {
    throw new Error('Not implemented');
  }
} 