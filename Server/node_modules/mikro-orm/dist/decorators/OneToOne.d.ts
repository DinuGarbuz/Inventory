import { OneToManyOptions } from './OneToMany';
import { EntityName, AnyEntity } from '../typings';
export declare function OneToOne<T extends AnyEntity<T>>(entity?: OneToOneOptions<T> | string | ((e?: any) => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<OneToOneOptions<T>>): (target: AnyEntity<any, string | number | symbol>, propertyName: string) => void;
export interface OneToOneOptions<T extends AnyEntity<T>> extends Partial<Omit<OneToManyOptions<T>, 'orderBy'>> {
    owner?: boolean;
    inversedBy?: (string & keyof T) | ((e: T) => any);
    wrappedReference?: boolean;
    primary?: boolean;
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    onUpdateIntegrity?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
}
