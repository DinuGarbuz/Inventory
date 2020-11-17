"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PostgreSqlConnection_1 = require("../connections/PostgreSqlConnection");
const AbstractSqlDriver_1 = require("./AbstractSqlDriver");
const PostgreSqlPlatform_1 = require("../platforms/PostgreSqlPlatform");
class PostgreSqlDriver extends AbstractSqlDriver_1.AbstractSqlDriver {
    constructor(config) {
        super(config, new PostgreSqlPlatform_1.PostgreSqlPlatform(), PostgreSqlConnection_1.PostgreSqlConnection, ['knex', 'pg']);
    }
}
exports.PostgreSqlDriver = PostgreSqlDriver;
