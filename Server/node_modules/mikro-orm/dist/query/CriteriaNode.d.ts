/// <reference types="node" />
import { inspect } from 'util';
import { Dictionary, EntityProperty } from '../typings';
import { MetadataStorage } from '../metadata';
import { QueryBuilder } from './QueryBuilder';
/**
 * Helper for working with deeply nested where/orderBy/having criteria. Uses composite pattern to build tree from the payload.
 * Auto-joins relations and converts payload from { books: { publisher: { name: '...' } } } to { 'publisher_alias.name': '...' }
 */
export declare class CriteriaNode {
    protected readonly metadata: MetadataStorage;
    readonly entityName: string;
    readonly parent?: CriteriaNode | undefined;
    readonly key?: string | undefined;
    payload: any;
    prop?: EntityProperty;
    constructor(metadata: MetadataStorage, entityName: string, parent?: CriteriaNode | undefined, key?: string | undefined, validate?: boolean);
    static create(metadata: MetadataStorage, entityName: string, payload: any, parent?: CriteriaNode, key?: string): CriteriaNode;
    process(qb: QueryBuilder, alias?: string): any;
    shouldInline(payload: any): boolean;
    shouldRename(payload: any): boolean;
    renameFieldToPK(qb: QueryBuilder): string;
    getPath(): string;
    [inspect.custom](): string;
}
export declare class ScalarCriteriaNode extends CriteriaNode {
    static create(metadata: MetadataStorage, entityName: string, payload: any, parent?: CriteriaNode, key?: string): ScalarCriteriaNode;
    process(qb: QueryBuilder, alias?: string): any;
    shouldJoin(): boolean;
}
export declare class ArrayCriteriaNode extends CriteriaNode {
    static create(metadata: MetadataStorage, entityName: string, payload: any[], parent?: CriteriaNode, key?: string): ArrayCriteriaNode;
    process(qb: QueryBuilder, alias?: string): any;
    getPath(): string;
}
export declare class ObjectCriteriaNode extends CriteriaNode {
    static create(metadata: MetadataStorage, entityName: string, payload: Dictionary, parent?: CriteriaNode, key?: string): ObjectCriteriaNode;
    process(qb: QueryBuilder, alias?: string): any;
    shouldInline(payload: any): boolean;
    private shouldAutoJoin;
    private autoJoin;
}
