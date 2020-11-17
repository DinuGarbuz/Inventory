import { AnyEntity, EntityProperty } from '../typings';
import { Hydrator } from './Hydrator';
export declare class ObjectHydrator extends Hydrator {
    protected hydrateProperty<T extends AnyEntity<T>>(entity: T, prop: EntityProperty, value: any, newEntity: boolean): void;
    private hydrateOneToMany;
    private hydrateScalar;
    private hydrateManyToMany;
    private hydrateManyToManyOwner;
    private hydrateManyToManyInverse;
    private hydrateManyToOne;
    private createCollectionItem;
}
