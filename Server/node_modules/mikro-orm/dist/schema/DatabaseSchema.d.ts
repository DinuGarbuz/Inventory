import { DatabaseTable } from './DatabaseTable';
import { SchemaHelper } from './SchemaHelper';
import { AbstractSqlConnection } from '../connections/AbstractSqlConnection';
import { Configuration } from '../utils';
export declare class DatabaseSchema {
    private readonly tables;
    addTable(name: string, schema: string | undefined): DatabaseTable;
    getTables(): DatabaseTable[];
    getTable(name: string): DatabaseTable | undefined;
    static create(connection: AbstractSqlConnection, helper: SchemaHelper, config: Configuration): Promise<DatabaseSchema>;
}
export interface Table {
    table_name: string;
    schema_name?: string;
}
