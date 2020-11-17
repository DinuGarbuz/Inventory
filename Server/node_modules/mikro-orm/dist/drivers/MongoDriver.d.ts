import { ClientSession } from 'mongodb';
import { DatabaseDriver } from './DatabaseDriver';
import { MongoConnection } from '../connections/MongoConnection';
import { AnyEntity, EntityData, FilterQuery } from '../typings';
import { Configuration } from '../utils';
import { MongoPlatform } from '../platforms/MongoPlatform';
import { FindOneOptions, FindOptions } from './IDatabaseDriver';
import { QueryResult, Transaction } from '../connections';
export declare class MongoDriver extends DatabaseDriver<MongoConnection> {
    protected readonly connection: MongoConnection;
    protected readonly platform: MongoPlatform;
    constructor(config: Configuration);
    find<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options: FindOptions, ctx?: Transaction<ClientSession>): Promise<T[]>;
    findOne<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions, ctx?: Transaction<ClientSession>): Promise<T | null>;
    count<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, ctx?: Transaction<ClientSession>): Promise<number>;
    nativeInsert<T extends AnyEntity<T>>(entityName: string, data: EntityData<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    nativeUpdate<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, data: EntityData<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    nativeDelete<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    aggregate(entityName: string, pipeline: any[], ctx?: Transaction<ClientSession>): Promise<any[]>;
    createCollections(): Promise<void>;
    dropCollections(): Promise<void>;
    ensureIndexes(): Promise<void>;
    private createIndexes;
    private createUniqueIndexes;
    private createPropertyIndexes;
    private renameFields;
    private convertObjectIds;
}
