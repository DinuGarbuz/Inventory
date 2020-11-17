"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("./Platform");
const SqliteSchemaHelper_1 = require("../schema/SqliteSchemaHelper");
class SqlitePlatform extends Platform_1.Platform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new SqliteSchemaHelper_1.SqliteSchemaHelper();
    }
    requiresNullableForAlteringColumn() {
        return true;
    }
    allowsMultiInsert() {
        return false;
    }
    getCurrentTimestampSQL(length) {
        return super.getCurrentTimestampSQL(0);
    }
}
exports.SqlitePlatform = SqlitePlatform;
