import { AnyEntity, Constructor, Dictionary, EntityMetadata, EntityName, EntityProperty } from '../typings';
import { EnumOptions, IndexOptions, ManyToManyOptions, ManyToOneOptions, OneToManyOptions, OneToOneOptions, PrimaryKeyOptions, PropertyOptions, SerializedPrimaryKeyOptions, UniqueOptions } from '../decorators';
import { Collection, EntityRepository, ReferenceType } from '../entity';
import { Type } from '../types';
declare type CollectionItem<T> = T extends Collection<infer K> ? K : T;
declare type TypeType = string | NumberConstructor | StringConstructor | BooleanConstructor | DateConstructor | ArrayConstructor | Constructor<Type>;
declare type TypeDef<T> = {
    type: TypeType;
} | {
    customType: Type;
} | {
    entity: string | (() => string | EntityName<T>);
};
declare type Property<T> = ({
    reference: ReferenceType.MANY_TO_ONE | 'm:1';
} & TypeDef<T> & ManyToOneOptions<T>) | ({
    reference: ReferenceType.ONE_TO_ONE | '1:1';
} & TypeDef<T> & OneToOneOptions<T>) | ({
    reference: ReferenceType.ONE_TO_MANY | '1:m';
} & TypeDef<T> & OneToManyOptions<T>) | ({
    reference: ReferenceType.MANY_TO_MANY | 'm:n';
} & TypeDef<T> & ManyToManyOptions<T>) | ({
    enum: true;
} & EnumOptions) | (TypeDef<T> & PropertyOptions);
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
declare type PropertyKey<T, U> = NonFunctionPropertyNames<Omit<T, keyof U>>;
declare type Metadata<T, U> = Omit<Partial<EntityMetadata<T>>, 'name' | 'properties'> & ({
    name: string;
} | {
    class: Constructor<T>;
    name?: string;
}) & {
    properties?: {
        [K in PropertyKey<T, U> & string]-?: Property<CollectionItem<NonNullable<T[K]>>>;
    };
};
export declare class EntitySchema<T extends AnyEntity<T> = AnyEntity, U extends AnyEntity<T> | undefined = undefined> {
    private readonly _meta;
    private readonly internal;
    private initialized;
    constructor(meta: Metadata<T, U> | EntityMetadata<T>, internal?: boolean);
    addProperty(name: string & keyof T, type?: TypeType, options?: PropertyOptions | EntityProperty): void;
    addEnum(name: string & keyof T, type?: TypeType, options?: EnumOptions): void;
    addVersion(name: string & keyof T, type: TypeType, options?: PropertyOptions): void;
    addPrimaryKey(name: string & keyof T, type: TypeType, options?: PrimaryKeyOptions): void;
    addSerializedPrimaryKey(name: string & keyof T, type: TypeType, options?: SerializedPrimaryKeyOptions): void;
    addManyToOne<K = object>(name: string & keyof T, type: TypeType, options: ManyToOneOptions<K>): void;
    addManyToMany<K = object>(name: string & keyof T, type: TypeType, options: ManyToManyOptions<K>): void;
    addOneToMany<K = object>(name: string & keyof T, type: TypeType, options: OneToManyOptions<K>): void;
    addOneToOne<K = object>(name: string & keyof T, type: TypeType, options: OneToOneOptions<K>): void;
    addIndex(options: Required<Omit<IndexOptions, 'name' | 'type' | 'options'>> & {
        name?: string;
        type?: string;
        options?: Dictionary;
    }): void;
    addUnique(options: Required<Omit<UniqueOptions, 'name' | 'options'>> & {
        name?: string;
        options?: Dictionary;
    }): void;
    setCustomRepository(repository: () => Constructor<EntityRepository<T>>): void;
    setExtends(base: string): void;
    setClass(proto: Constructor<T>): void;
    readonly meta: EntityMetadata<T>;
    readonly name: string;
    /**
     * @internal
     */
    init(): this;
    private initProperties;
    private initPrimaryKeys;
    private normalizeType;
}
export {};
