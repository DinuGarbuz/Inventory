import { EntityManager } from './EntityManager';
import { IDatabaseDriver } from './drivers';
import { MetadataStorage } from './metadata';
import { Configuration, Options } from './utils';
import { SchemaGenerator } from './schema';
import { EntityGenerator } from './schema/EntityGenerator';
import { Migrator } from './migrations';
/**
 * Helper class for bootstrapping the MikroORM.
 */
export declare class MikroORM<D extends IDatabaseDriver = IDatabaseDriver> {
    em: EntityManager<D>;
    readonly config: Configuration<D>;
    private metadata;
    private readonly driver;
    private readonly logger;
    /**
     * Initialize the ORM, load entity metadata, create EntityManager and connect to the database.
     * If you omit the `options` parameter, your CLI config will be used.
     */
    static init<D extends IDatabaseDriver = IDatabaseDriver>(options?: Options<D> | Configuration<D>): Promise<MikroORM<D>>;
    constructor(options: Options<D> | Configuration<D>);
    /**
     * Connects to the database.
     */
    connect(): Promise<D>;
    /**
     * Checks whether the database connection is active.
     */
    isConnected(): Promise<boolean>;
    /**
     * Closes the database connection.
     */
    close(force?: boolean): Promise<void>;
    /**
     * Gets the MetadataStorage.
     */
    getMetadata(): MetadataStorage;
    /**
     * Gets the SchemaGenerator.
     */
    getSchemaGenerator(): SchemaGenerator;
    /**
     * Gets the EntityGenerator.
     */
    getEntityGenerator(): EntityGenerator;
    /**
     * Gets the Migrator.
     */
    getMigrator(): Migrator;
}
