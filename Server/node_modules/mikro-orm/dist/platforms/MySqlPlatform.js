"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Platform_1 = require("./Platform");
const MySqlSchemaHelper_1 = require("../schema/MySqlSchemaHelper");
class MySqlPlatform extends Platform_1.Platform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new MySqlSchemaHelper_1.MySqlSchemaHelper();
    }
    getDefaultCharset() {
        return 'utf8mb4';
    }
}
exports.MySqlPlatform = MySqlPlatform;
