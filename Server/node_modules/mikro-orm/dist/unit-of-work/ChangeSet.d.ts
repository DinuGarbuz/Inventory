import { EntityData, AnyEntity, WrappedEntity, Primary } from '../typings';
export interface ChangeSet<T extends AnyEntity<T>> {
    name: string;
    collection: string;
    type: ChangeSetType;
    entity: T & WrappedEntity<T, Primary<T> & keyof T>;
    payload: EntityData<T>;
    persisted: boolean;
}
export declare enum ChangeSetType {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
