"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("./Platform");
const PostgreSqlSchemaHelper_1 = require("../schema/PostgreSqlSchemaHelper");
class PostgreSqlPlatform extends Platform_1.Platform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new PostgreSqlSchemaHelper_1.PostgreSqlSchemaHelper();
    }
    usesReturningStatement() {
        return true;
    }
    usesCascadeStatement() {
        return true;
    }
    getCurrentTimestampSQL(length) {
        return `current_timestamp(${length})`;
    }
    getTimeTypeDeclarationSQL() {
        return 'time(0)';
    }
    getRegExpOperator() {
        return '~';
    }
    isBigIntProperty(prop) {
        return super.isBigIntProperty(prop) || (prop.columnTypes && prop.columnTypes[0] === 'bigserial');
    }
}
exports.PostgreSqlPlatform = PostgreSqlPlatform;
