import 'reflect-metadata';
import { MetadataProvider } from './MetadataProvider';
import { EntityMetadata, EntityProperty } from '../typings';
export declare class ReflectMetadataProvider extends MetadataProvider {
    loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    protected initPropertyType(meta: EntityMetadata, prop: EntityProperty): void;
}
