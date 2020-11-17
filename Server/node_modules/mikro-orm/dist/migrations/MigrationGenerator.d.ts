import { CodeBlockWriter } from 'ts-morph';
import { AbstractSqlDriver } from '../drivers';
import { MigrationsOptions } from '../utils';
export declare class MigrationGenerator {
    protected readonly driver: AbstractSqlDriver;
    protected readonly options: MigrationsOptions;
    private readonly project;
    constructor(driver: AbstractSqlDriver, options: MigrationsOptions);
    generate(diff: string[], path?: string): Promise<[string, string]>;
    createStatement(writer: CodeBlockWriter, sql: string): void;
    generateJSMigrationFile(writer: CodeBlockWriter, className: string, diff: string[]): void;
    generateTSMigrationFile(writer: CodeBlockWriter, className: string, diff: string[]): void;
}
