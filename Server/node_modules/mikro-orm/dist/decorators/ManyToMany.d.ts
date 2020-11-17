import { ReferenceOptions } from './Property';
import { EntityName, AnyEntity } from '../typings';
import { QueryOrder } from '../query';
export declare function ManyToMany<T extends AnyEntity<T>>(entity?: ManyToManyOptions<T> | string | (() => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<ManyToManyOptions<T>>): (target: AnyEntity<any, string | number | symbol>, propertyName: string) => void;
export interface ManyToManyOptions<T extends AnyEntity<T>> extends ReferenceOptions<T> {
    owner?: boolean;
    inversedBy?: (string & keyof T) | ((e: T) => any);
    mappedBy?: (string & keyof T) | ((e: T) => any);
    orderBy?: {
        [field: string]: QueryOrder;
    };
    fixedOrder?: boolean;
    fixedOrderColumn?: string;
    pivotTable?: string;
    joinColumn?: string;
    joinColumns?: string[];
    inverseJoinColumn?: string;
    inverseJoinColumns?: string[];
    referenceColumnName?: string;
}
