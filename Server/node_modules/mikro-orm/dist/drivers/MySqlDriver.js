"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySqlConnection_1 = require("../connections/MySqlConnection");
const AbstractSqlDriver_1 = require("./AbstractSqlDriver");
const MySqlPlatform_1 = require("../platforms/MySqlPlatform");
class MySqlDriver extends AbstractSqlDriver_1.AbstractSqlDriver {
    constructor(config) {
        super(config, new MySqlPlatform_1.MySqlPlatform(), MySqlConnection_1.MySqlConnection, ['knex', 'mysql2']);
    }
}
exports.MySqlDriver = MySqlDriver;
