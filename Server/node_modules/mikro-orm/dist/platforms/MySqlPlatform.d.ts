import { Platform } from './Platform';
import { MySqlSchemaHelper } from '../schema/MySqlSchemaHelper';
export declare class MySqlPlatform extends Platform {
    protected readonly schemaHelper: MySqlSchemaHelper;
    getDefaultCharset(): string;
}
