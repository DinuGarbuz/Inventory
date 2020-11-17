import { AbstractSqlDriver } from '../drivers';
import { MigrationsOptions } from '../utils';
import { Transaction } from '../connections';
export declare class MigrationStorage {
    protected readonly driver: AbstractSqlDriver;
    protected readonly options: MigrationsOptions;
    private readonly connection;
    private readonly knex;
    private readonly helper;
    private masterTransaction?;
    constructor(driver: AbstractSqlDriver, options: MigrationsOptions);
    executed(): Promise<string[]>;
    logMigration(name: string): Promise<void>;
    unlogMigration(name: string): Promise<void>;
    getExecutedMigrations(): Promise<MigrationRow[]>;
    ensureTable(): Promise<void>;
    setMasterMigration(trx: Transaction): void;
    unsetMasterMigration(): void;
}
export interface MigrationRow {
    name: string;
    executed_at: Date;
}
