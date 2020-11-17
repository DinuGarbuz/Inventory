import { Transaction as KnexTransaction } from 'knex';
import { AnyEntity, Constructor, Dictionary, EntityData, EntityMetadata, EntityProperty, FilterQuery, Primary } from '../typings';
import { DatabaseDriver } from './DatabaseDriver';
import { QueryResult, Transaction } from '../connections';
import { AbstractSqlConnection } from '../connections/AbstractSqlConnection';
import { Collection } from '../entity';
import { QueryBuilder, QueryOrderMap } from '../query';
import { Configuration } from '../utils';
import { Platform } from '../platforms';
import { FindOneOptions, FindOptions } from './IDatabaseDriver';
export declare abstract class AbstractSqlDriver<C extends AbstractSqlConnection = AbstractSqlConnection> extends DatabaseDriver<C> {
    protected readonly connection: C;
    protected readonly replicas: C[];
    protected readonly platform: Platform;
    protected constructor(config: Configuration, platform: Platform, connection: Constructor<C>, connector: string[]);
    find<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOptions, ctx?: Transaction<KnexTransaction>): Promise<T[]>;
    findOne<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions, ctx?: Transaction<KnexTransaction>): Promise<T | null>;
    count(entityName: string, where: any, ctx?: Transaction<KnexTransaction>): Promise<number>;
    nativeInsert<T extends AnyEntity<T>>(entityName: string, data: EntityData<T>, ctx?: Transaction<KnexTransaction>): Promise<QueryResult>;
    nativeUpdate<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, data: EntityData<T>, ctx?: Transaction<KnexTransaction>): Promise<QueryResult>;
    nativeDelete<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T> | string | any, ctx?: Transaction<KnexTransaction>): Promise<QueryResult>;
    syncCollection<T extends AnyEntity<T>, O extends AnyEntity<O>>(coll: Collection<T, O>, ctx?: Transaction): Promise<void>;
    loadFromPivotTable<T extends AnyEntity<T>, O extends AnyEntity<O>>(prop: EntityProperty, owners: Primary<O>[][], where?: FilterQuery<T>, orderBy?: QueryOrderMap, ctx?: Transaction): Promise<Dictionary<T[]>>;
    /**
     * 1:1 owner side needs to be marked for population so QB auto-joins the owner id
     */
    protected autoJoinOneToOneOwner(meta: EntityMetadata, populate: string[]): string[];
    protected createQueryBuilder<T extends AnyEntity<T>>(entityName: string, ctx?: Transaction<KnexTransaction>, write?: boolean): QueryBuilder<T>;
    protected extractManyToMany<T extends AnyEntity<T>>(entityName: string, data: EntityData<T>): EntityData<T>;
    protected processManyToMany<T extends AnyEntity<T>>(meta: EntityMetadata<T> | undefined, pks: Primary<T>[], collections: EntityData<T>, clear: boolean, ctx?: Transaction<KnexTransaction>): Promise<void>;
    protected updateCollectionDiff<T extends AnyEntity<T>, O extends AnyEntity<O>>(meta: EntityMetadata<O>, prop: EntityProperty<T>, pks: Primary<O>[], deleteDiff: Primary<T>[][] | boolean, insertDiff: Primary<T>[][], ctx?: Transaction): Promise<void>;
}
