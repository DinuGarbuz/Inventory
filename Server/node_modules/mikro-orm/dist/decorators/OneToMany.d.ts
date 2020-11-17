import { ReferenceOptions } from './Property';
import { ReferenceType } from '../entity';
import { QueryOrder } from '../query';
import { EntityName, AnyEntity } from '../typings';
export declare function OneToMany<T extends AnyEntity<T>>(entity: OneToManyOptions<T> | string | ((e?: any) => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<OneToManyOptions<T>>): (target: AnyEntity<any, string | number | symbol>, propertyName: string) => void;
export declare function createOneToDecorator<T extends AnyEntity<T>>(entity?: OneToManyOptions<T> | string | ((e?: any) => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<OneToManyOptions<T>>, reference?: ReferenceType): (target: AnyEntity<any, string | number | symbol>, propertyName: string) => void;
export declare type OneToManyOptions<T extends AnyEntity<T>> = ReferenceOptions<T> & {
    entity?: string | (() => EntityName<T>);
    orphanRemoval?: boolean;
    orderBy?: {
        [field: string]: QueryOrder;
    };
    joinColumn?: string;
    joinColumns?: string[];
    inverseJoinColumn?: string;
    inverseJoinColumns?: string[];
    referenceColumnName?: string;
    mappedBy?: (string & keyof T) | ((e: T) => any);
};
