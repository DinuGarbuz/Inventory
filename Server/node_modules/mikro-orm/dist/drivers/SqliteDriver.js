"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqliteConnection_1 = require("../connections/SqliteConnection");
const AbstractSqlDriver_1 = require("./AbstractSqlDriver");
const SqlitePlatform_1 = require("../platforms/SqlitePlatform");
class SqliteDriver extends AbstractSqlDriver_1.AbstractSqlDriver {
    constructor(config) {
        super(config, new SqlitePlatform_1.SqlitePlatform(), SqliteConnection_1.SqliteConnection, ['knex', 'sqlite3']);
    }
}
exports.SqliteDriver = SqliteDriver;
