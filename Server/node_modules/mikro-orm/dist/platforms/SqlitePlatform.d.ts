import { Platform } from './Platform';
import { SqliteSchemaHelper } from '../schema/SqliteSchemaHelper';
export declare class SqlitePlatform extends Platform {
    protected readonly schemaHelper: SqliteSchemaHelper;
    requiresNullableForAlteringColumn(): boolean;
    allowsMultiInsert(): boolean;
    getCurrentTimestampSQL(length: number): string;
}
