import { CreateTableBuilder } from 'knex';
import { IsSame, SchemaHelper } from './SchemaHelper';
import { Dictionary, EntityProperty } from '../typings';
import { AbstractSqlConnection } from '../connections';
import { Column, Index } from './DatabaseTable';
export declare class MySqlSchemaHelper extends SchemaHelper {
    static readonly TYPES: {
        boolean: string[];
        number: string[];
        float: string[];
        double: string[];
        tinyint: string[];
        smallint: string[];
        Date: string[];
        date: string[];
        string: string[];
        text: string[];
        object: string[];
        json: string[];
        enum: string[];
    };
    static readonly DEFAULT_TYPE_LENGTHS: {
        number: number;
        string: number;
        date: number;
    };
    static readonly DEFAULT_VALUES: {
        'now()': string[];
        'current_timestamp(?)': string[];
        '0': string[];
    };
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    finalizeTable(table: CreateTableBuilder, charset: string): void;
    getTypeDefinition(prop: EntityProperty): string;
    getTypeFromDefinition(type: string, defaultType: string): string;
    getListTablesSQL(): string;
    getRenameColumnSQL(tableName: string, from: Column, to: EntityProperty, idx?: number): string;
    getForeignKeysSQL(tableName: string, schemaName?: string): string;
    getEnumDefinitions(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<any[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    isSame(prop: EntityProperty, column: Column, idx?: number): IsSame;
    normalizeDefaultValue(defaultValue: string, length: number): string | number;
}
