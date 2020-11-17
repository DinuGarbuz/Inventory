import { NamingStrategy } from '../naming-strategy';
import { EntityProperty, IPrimaryKey, Primary } from '../typings';
import { SchemaHelper } from '../schema';
export declare abstract class Platform {
    protected readonly abstract schemaHelper?: SchemaHelper;
    usesPivotTable(): boolean;
    supportsTransactions(): boolean;
    usesImplicitTransactions(): boolean;
    getNamingStrategy(): {
        new (): NamingStrategy;
    };
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    getSchemaHelper(): SchemaHelper | undefined;
    requiresNullableForAlteringColumn(): boolean;
    allowsMultiInsert(): boolean;
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey<T extends number | string = number | string>(data: Primary<T> | IPrimaryKey): T;
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data: IPrimaryKey): IPrimaryKey;
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field: string): string;
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length: number): string;
    getDateTypeDeclarationSQL(length: number): string;
    getTimeTypeDeclarationSQL(length: number): string;
    getRegExpOperator(): string;
    isBigIntProperty(prop: EntityProperty): boolean;
    getBigIntTypeDeclarationSQL(): string;
    getDefaultCharset(): string;
}
