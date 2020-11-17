import Knex, { QueryBuilder as KnexQueryBuilder, Raw } from 'knex';
import { Dictionary, EntityMetadata, EntityProperty } from '../typings';
import { FlatQueryOrderMap, QueryType } from './enums';
import { Platform } from '../platforms';
import { JoinOptions } from './QueryBuilder';
import { LockMode } from '../unit-of-work';
import { MetadataStorage } from '../metadata';
export declare class QueryBuilderHelper {
    private readonly entityName;
    private readonly alias;
    private readonly aliasMap;
    private readonly metadata;
    private readonly knex;
    private readonly platform;
    static readonly GROUP_OPERATORS: {
        $and: string;
        $or: string;
    };
    static readonly OPERATORS: {
        $eq: string;
        $in: string;
        $nin: string;
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $not: string;
        $like: string;
        $re: string;
    };
    constructor(entityName: string, alias: string, aliasMap: Dictionary<string>, metadata: MetadataStorage, knex: Knex, platform: Platform);
    mapper(field: string, type?: QueryType): string;
    mapper(field: string, type?: QueryType, value?: any, alias?: string): string;
    processData(data: Dictionary): any;
    joinOneToReference(prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    joinManyToOneReference(prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    joinManyToManyReference(prop: EntityProperty, ownerAlias: string, alias: string, pivotAlias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond: Dictionary): Dictionary<JoinOptions>;
    joinPivotTable(field: string, prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    processJoins(qb: KnexQueryBuilder, joins: Dictionary<JoinOptions>): void;
    mapJoinColumns(type: QueryType, join: JoinOptions): (string | Raw)[];
    isOneToOneInverse(field: string): boolean;
    getTableName(entityName: string): string;
    /**
     * Checks whether the RE can be rewritten to simple LIKE query
     */
    isSimpleRegExp(re: any): boolean;
    getRegExpParam(re: RegExp): string;
    appendQueryCondition(type: QueryType, cond: any, qb: KnexQueryBuilder, operator?: '$and' | '$or', method?: 'where' | 'having'): void;
    private appendQuerySubCondition;
    private processCustomExpression;
    private processObjectSubCondition;
    private getOperatorReplacement;
    private appendJoinClause;
    private appendJoinSubClause;
    private processObjectSubClause;
    getQueryOrder(type: QueryType, orderBy: FlatQueryOrderMap, populate: Dictionary<string>): {
        column: string;
        order: string;
    }[];
    finalize(type: QueryType, qb: KnexQueryBuilder, meta?: EntityMetadata): void;
    splitField(field: string): [string, string];
    getLockSQL(qb: KnexQueryBuilder, lockMode?: LockMode): void;
    updateVersionProperty(qb: KnexQueryBuilder): void;
    static isOperator(key: string, includeGroupOperators?: boolean): boolean;
    static isCustomExpression(field: string): boolean;
    private prefix;
    private appendGroupCondition;
    private isPrefixed;
    private fieldName;
    private getProperty;
}
