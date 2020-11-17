import { QueryBuilder as KnexQueryBuilder, Transaction, Value } from 'knex';
import { QueryBuilderHelper } from './QueryBuilderHelper';
import { AnyEntity, Dictionary, EntityProperty, QBFilterQuery } from '../typings';
import { QueryFlag, QueryOrderMap, QueryType } from './enums';
import { LockMode } from '../unit-of-work';
import { AbstractSqlDriver } from '../drivers';
import { MetadataStorage } from '../metadata';
import { CriteriaNode } from './CriteriaNode';
import { EntityManager } from '../EntityManager';
/**
 * SQL query builder
 */
export declare class QueryBuilder<T extends AnyEntity<T> = AnyEntity> {
    private readonly entityName;
    private readonly metadata;
    private readonly driver;
    private readonly context?;
    readonly alias: string;
    private readonly connectionType?;
    private readonly em?;
    type: QueryType;
    _fields?: string[];
    _populate: string[];
    _populateMap: Dictionary<string>;
    private aliasCounter;
    private flags;
    private finalized;
    private _joins;
    private _aliasMap;
    private _schema?;
    private _cond;
    private _data;
    private _orderBy;
    private _groupBy;
    private _having;
    private _limit?;
    private _offset?;
    private lockMode?;
    private readonly platform;
    private readonly knex;
    private readonly helper;
    constructor(entityName: string, metadata: MetadataStorage, driver: AbstractSqlDriver, context?: Transaction<any, any> | undefined, alias?: string, connectionType?: "write" | "read" | undefined, em?: EntityManager<import("../drivers").IDatabaseDriver<import("..").Connection>> | undefined);
    select(fields: string | string[], distinct?: boolean): this;
    addSelect(fields: string | string[]): this;
    insert(data: any): this;
    update(data: any): this;
    delete(cond?: QBFilterQuery): this;
    truncate(): this;
    count(field?: string | string[], distinct?: boolean): this;
    join(field: string, alias: string, cond?: QBFilterQuery, type?: 'leftJoin' | 'innerJoin' | 'pivotJoin', path?: string): this;
    leftJoin(field: string, alias: string, cond?: QBFilterQuery): this;
    where(cond: QBFilterQuery<T>, operator?: keyof typeof QueryBuilderHelper.GROUP_OPERATORS): this;
    where(cond: string, params?: any[], operator?: keyof typeof QueryBuilderHelper.GROUP_OPERATORS): this;
    andWhere(cond: QBFilterQuery<T>): this;
    andWhere(cond: string, params?: any[]): this;
    orWhere(cond: QBFilterQuery<T>): this;
    orWhere(cond: string, params?: any[]): this;
    orderBy(orderBy: QueryOrderMap): this;
    groupBy(fields: string | string[]): this;
    having(cond: QBFilterQuery | string, params?: any[]): this;
    /**
     * @internal
     */
    populate(populate: string[]): this;
    limit(limit: number, offset?: number): this;
    offset(offset: number): this;
    withSchema(schema?: string): this;
    setLockMode(mode?: LockMode): this;
    setFlag(flag: QueryFlag): this;
    getKnexQuery(): KnexQueryBuilder;
    getQuery(): string;
    getParams(): readonly Value[];
    getAliasForEntity(entityName: string, node: CriteriaNode): string | undefined;
    getNextAlias(): string;
    execute<U = any>(method?: 'all' | 'get' | 'run', mapResults?: boolean): Promise<U>;
    getResult(): Promise<T[]>;
    getSingleResult(): Promise<T | null>;
    clone(): QueryBuilder<T>;
    getKnex(): KnexQueryBuilder;
    private joinReference;
    private prepareFields;
    private init;
    private getQueryBase;
    private finalize;
    private autoJoinPivotTable;
}
export interface JoinOptions {
    table: string;
    type: 'leftJoin' | 'innerJoin' | 'pivotJoin';
    alias: string;
    ownerAlias: string;
    inverseAlias?: string;
    joinColumns?: string[];
    inverseJoinColumns?: string[];
    primaryKeys?: string[];
    path?: string;
    prop: EntityProperty;
    cond: Dictionary;
}
