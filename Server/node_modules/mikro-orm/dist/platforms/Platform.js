"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naming_strategy_1 = require("../naming-strategy");
class Platform {
    usesPivotTable() {
        return true;
    }
    supportsTransactions() {
        return true;
    }
    usesImplicitTransactions() {
        return true;
    }
    getNamingStrategy() {
        return naming_strategy_1.UnderscoreNamingStrategy;
    }
    usesReturningStatement() {
        return false;
    }
    usesCascadeStatement() {
        return false;
    }
    getSchemaHelper() {
        return this.schemaHelper;
    }
    requiresNullableForAlteringColumn() {
        return false;
    }
    allowsMultiInsert() {
        return true;
    }
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey(data) {
        return data;
    }
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data) {
        return data;
    }
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field) {
        return field;
    }
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length) {
        return 'current_timestamp' + (length ? `(${length})` : '');
    }
    getDateTypeDeclarationSQL(length) {
        return 'date' + (length ? `(${length})` : '');
    }
    getTimeTypeDeclarationSQL(length) {
        return 'time' + (length ? `(${length})` : '');
    }
    getRegExpOperator() {
        return 'regexp';
    }
    isBigIntProperty(prop) {
        return prop.columnTypes && prop.columnTypes[0] === 'bigint';
    }
    getBigIntTypeDeclarationSQL() {
        return 'bigint';
    }
    getDefaultCharset() {
        return 'utf8';
    }
}
exports.Platform = Platform;
