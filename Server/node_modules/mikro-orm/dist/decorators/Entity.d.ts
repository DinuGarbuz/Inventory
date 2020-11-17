import { EntityRepository } from '../entity';
import { AnyEntity, Constructor } from '../typings';
export declare function Entity(options?: EntityOptions<any>): Function;
export declare type EntityOptions<T extends AnyEntity<T>> = {
    tableName?: string;
    collection?: string;
    customRepository?: () => Constructor<EntityRepository<T>>;
};
