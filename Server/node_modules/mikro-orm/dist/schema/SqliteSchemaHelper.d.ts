import { IsSame, SchemaHelper } from './SchemaHelper';
import { Dictionary, EntityProperty } from '../typings';
import { AbstractSqlConnection } from '../connections/AbstractSqlConnection';
import { Column, Index } from './DatabaseTable';
import { Connection } from '../connections';
export declare class SqliteSchemaHelper extends SchemaHelper {
    static readonly TYPES: {
        number: string[];
        tinyint: string[];
        smallint: string[];
        bigint: string[];
        boolean: string[];
        string: string[];
        Date: string[];
        date: string[];
        object: string[];
        text: string[];
    };
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    isSame(prop: EntityProperty, type: Column, idx?: number): IsSame;
    getTypeDefinition(prop: EntityProperty): string;
    getTypeFromDefinition(type: string, defaultType: string): string;
    supportsSchemaConstraints(): boolean;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<any[]>;
    getPrimaryKeys(connection: AbstractSqlConnection, indexes: Dictionary, tableName: string, schemaName?: string): Promise<string[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    getRenameColumnSQL(tableName: string, from: Column, to: EntityProperty, idx?: number): string;
    getForeignKeysSQL(tableName: string): string;
    mapForeignKeys(fks: any[]): Dictionary;
    supportsColumnAlter(): boolean;
    databaseExists(connection: Connection, name: string): Promise<boolean>;
}
