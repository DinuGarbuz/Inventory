import { Cascade } from '../entity';
import { EntityName, AnyEntity, Constructor } from '../typings';
import { Type } from '../types';
export declare function Property(options?: PropertyOptions): Function;
export declare type PropertyOptions = {
    name?: string;
    fieldName?: string;
    fieldNames?: string[];
    customType?: Type;
    columnType?: string;
    type?: 'string' | 'number' | 'boolean' | 'bigint' | 'ObjectId' | string | object | String | Number | Boolean | Date | Constructor<Type>;
    length?: any;
    onCreate?: () => any;
    onUpdate?: () => any;
    default?: any;
    nullable?: boolean;
    unsigned?: boolean;
    persist?: boolean;
    hidden?: boolean;
    version?: boolean;
    index?: boolean | string;
    unique?: boolean | string;
    primary?: boolean;
    serializedPrimaryKey?: boolean;
};
export interface ReferenceOptions<T extends AnyEntity<T>> extends PropertyOptions {
    entity?: string | (() => EntityName<T>);
    cascade?: Cascade[];
    eager?: boolean;
}
