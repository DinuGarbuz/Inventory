import { AbstractSqlDriver } from '../drivers';
import { Configuration } from '../utils';
import { SchemaGenerator } from '../schema';
import { MigrationRow } from './MigrationStorage';
export declare class Migrator {
    private readonly driver;
    private readonly schemaGenerator;
    private readonly config;
    private readonly umzug;
    private readonly options;
    private readonly runner;
    private readonly generator;
    private readonly storage;
    constructor(driver: AbstractSqlDriver, schemaGenerator: SchemaGenerator, config: Configuration);
    createMigration(path?: string, blank?: boolean): Promise<MigrationResult>;
    getExecutedMigrations(): Promise<MigrationRow[]>;
    getPendingMigrations(): Promise<UmzugMigration[]>;
    up(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
    down(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
    private getSchemaDiff;
    private resolve;
    private prefix;
    private runMigrations;
}
export declare type UmzugMigration = {
    path?: string;
    file: string;
};
export declare type MigrateOptions = {
    from?: string | number;
    to?: string | number;
    migrations?: string[];
};
export declare type MigrationResult = {
    fileName: string;
    code: string;
    diff: string[];
};
