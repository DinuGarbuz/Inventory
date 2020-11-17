import { ReferenceOptions } from './Property';
import { AnyEntity, EntityName } from '../typings';
export declare function ManyToOne<T extends AnyEntity<T>>(entity?: ManyToOneOptions<T> | string | ((e?: any) => EntityName<T>), options?: Partial<ManyToOneOptions<T>>): (target: AnyEntity<any, string | number | symbol>, propertyName: string) => void;
export interface ManyToOneOptions<T extends AnyEntity<T>> extends ReferenceOptions<T> {
    inversedBy?: (string & keyof T) | ((e: T) => any);
    wrappedReference?: boolean;
    primary?: boolean;
    joinColumn?: string;
    joinColumns?: string[];
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    onUpdateIntegrity?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
}
