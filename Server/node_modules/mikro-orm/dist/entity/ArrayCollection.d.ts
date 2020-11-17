import { AnyEntity, Dictionary, EntityProperty, IPrimaryKey, Primary } from '../typings';
import { Collection } from './Collection';
export declare class ArrayCollection<T extends AnyEntity<T>, O extends AnyEntity<O>> {
    readonly owner: O;
    [k: number]: T;
    protected readonly items: T[];
    private _property?;
    constructor(owner: O, items?: T[]);
    getItems(): T[];
    toArray(): Dictionary[];
    getIdentifiers<U extends IPrimaryKey = Primary<T> & IPrimaryKey>(field?: string): U[];
    add(...items: T[]): void;
    set(items: T[]): void;
    hydrate(items: T[]): void;
    remove(...items: T[]): void;
    removeAll(): void;
    contains(item: T): boolean;
    count(): number;
    readonly length: number;
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * @internal
     */
    readonly property: EntityProperty;
    protected propagate(item: T, method: 'add' | 'remove'): void;
    protected propagateToInverseSide(item: T, method: 'add' | 'remove'): void;
    protected propagateToOwningSide(item: T, method: 'add' | 'remove'): void;
    protected shouldPropagateToCollection(collection: Collection<O, T>, method: 'add' | 'remove'): boolean;
}
