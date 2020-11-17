import { Dictionary, EntityMetadata, AnyEntity, Primary } from '../typings';
import { EntityManager } from '../EntityManager';
import { Platform } from '../platforms';
import { MetadataStorage } from '../metadata';
import { EntityValidator } from './EntityValidator';
export declare type IdentifiedReference<T extends AnyEntity<T>, PK extends keyof T = 'id' & keyof T> = {
    [K in PK]: T[K];
} & Reference<T>;
export declare class Reference<T extends AnyEntity<T>> {
    private entity;
    constructor(entity: T);
    static create<T extends AnyEntity<T>, PK extends keyof T>(entity: T | IdentifiedReference<T, PK>): IdentifiedReference<T, PK>;
    load(): Promise<T>;
    get<K extends keyof T>(prop: K): Promise<T[K]>;
    set(entity: T | IdentifiedReference<T>): void;
    unwrap(): T;
    getEntity(): T;
    getProperty<K extends keyof T>(prop: K): T[K];
    isInitialized(): boolean;
    populated(populated?: boolean): void;
    toJSON(...args: any[]): Dictionary;
    readonly __primaryKey: Primary<T>;
    readonly __primaryKeys: Primary<T>[];
    readonly __uuid: string;
    readonly __em: EntityManager | undefined;
    readonly __internal: {
        platform: Platform;
        metadata: MetadataStorage;
        validator: EntityValidator;
    };
    readonly __meta: EntityMetadata;
    readonly __populated: boolean;
    readonly __lazyInitialized: boolean;
}
