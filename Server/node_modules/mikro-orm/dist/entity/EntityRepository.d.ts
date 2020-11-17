import { EntityManager, FindOneOrFailOptions } from '../EntityManager';
import { EntityData, EntityName, AnyEntity, Primary } from '../typings';
import { QueryBuilder, QueryOrderMap } from '../query';
import { FilterQuery, FindOneOptions, FindOptions, IdentifiedReference, Reference } from '..';
export declare class EntityRepository<T extends AnyEntity<T>> {
    protected readonly em: EntityManager;
    protected readonly entityName: EntityName<T>;
    constructor(em: EntityManager, entityName: EntityName<T>);
    persist(entity: AnyEntity | AnyEntity[], flush?: boolean): void | Promise<void>;
    persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
    persistLater(entity: AnyEntity | AnyEntity[]): void;
    createQueryBuilder(alias?: string): QueryBuilder<T>;
    findOne(where: FilterQuery<T>, populate?: string[] | boolean, orderBy?: QueryOrderMap): Promise<T | null>;
    findOne(where: FilterQuery<T>, populate?: FindOneOptions, orderBy?: QueryOrderMap): Promise<T | null>;
    findOneOrFail(where: FilterQuery<T>, populate?: string[] | boolean, orderBy?: QueryOrderMap): Promise<T>;
    findOneOrFail(where: FilterQuery<T>, populate?: FindOneOrFailOptions, orderBy?: QueryOrderMap): Promise<T>;
    find(where: FilterQuery<T>, options?: FindOptions): Promise<T[]>;
    find(where: FilterQuery<T>, populate?: string[] | boolean, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<T[]>;
    findAndCount(where: FilterQuery<T>, options?: FindOptions): Promise<[T[], number]>;
    findAndCount(where: FilterQuery<T>, populate?: string[] | boolean, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<[T[], number]>;
    findAll(options?: FindOptions): Promise<T[]>;
    findAll(populate?: string[] | boolean | true, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<T[]>;
    remove(where: T | FilterQuery<T>, flush?: boolean): void | Promise<number>;
    removeAndFlush(entity: AnyEntity): Promise<void>;
    removeLater(entity: AnyEntity): void;
    flush(): Promise<void>;
    nativeInsert(data: EntityData<T>): Promise<Primary<T>>;
    nativeUpdate(where: FilterQuery<T>, data: EntityData<T>): Promise<number>;
    nativeDelete(where: FilterQuery<T> | any): Promise<number>;
    map(result: EntityData<T>): T;
    aggregate(pipeline: any[]): Promise<any[]>;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<PK extends keyof T>(id: Primary<T>, wrapped: true): IdentifiedReference<T, PK>;
    getReference<PK extends keyof T = keyof T>(id: Primary<T>): T;
    getReference<PK extends keyof T = keyof T>(id: Primary<T>, wrapped: false): T;
    getReference<PK extends keyof T = keyof T>(id: Primary<T>, wrapped: true): Reference<T>;
    canPopulate(property: string): boolean;
    populate<A extends T | T[]>(entities: A, populate: string | string[] | boolean, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<A>;
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create(data: EntityData<T>): T;
    count(where?: FilterQuery<T>): Promise<number>;
}
