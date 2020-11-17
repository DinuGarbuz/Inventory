import { Platform } from './Platform';
import { PostgreSqlSchemaHelper } from '../schema/PostgreSqlSchemaHelper';
import { EntityProperty } from '../typings';
export declare class PostgreSqlPlatform extends Platform {
    protected readonly schemaHelper: PostgreSqlSchemaHelper;
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    getCurrentTimestampSQL(length: number): string;
    getTimeTypeDeclarationSQL(): string;
    getRegExpOperator(): string;
    isBigIntProperty(prop: EntityProperty): boolean;
}
