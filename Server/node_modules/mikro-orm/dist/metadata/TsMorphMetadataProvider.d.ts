import { SourceFile } from 'ts-morph';
import { MetadataProvider } from './MetadataProvider';
import { EntityMetadata } from '../typings';
export declare class TsMorphMetadataProvider extends MetadataProvider {
    private readonly project;
    private sources;
    loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    getExistingSourceFile(meta: EntityMetadata): Promise<SourceFile>;
    protected initProperties(meta: EntityMetadata): Promise<void>;
    private extractType;
    private initPropertyType;
    private readTypeFromSource;
    private getSourceFile;
    private processWrapper;
    private initSourceFiles;
    private validateDirectories;
}
