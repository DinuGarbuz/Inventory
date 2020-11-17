import { AnyEntity, FilterQuery } from '../typings';
import { EntityManager } from '../EntityManager';
import { QueryOrderMap } from '../query';
export declare class EntityLoader {
    private readonly em;
    private readonly metadata;
    private readonly driver;
    constructor(em: EntityManager);
    populate<T extends AnyEntity<T>>(entityName: string, entities: T[], populate: string | string[] | boolean, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean, lookup?: boolean): Promise<void>;
    private normalizePopulate;
    /**
     * preload everything in one call (this will update already existing references in IM)
     */
    private populateMany;
    private initializeCollections;
    private initializeOneToMany;
    private initializeManyToMany;
    private findChildren;
    private populateField;
    private findChildrenFromPivotTable;
    private getChildReferences;
    private filterCollections;
    private filterReferences;
    private lookupAllRelationships;
    private lookupEagerLoadedRelationships;
}
