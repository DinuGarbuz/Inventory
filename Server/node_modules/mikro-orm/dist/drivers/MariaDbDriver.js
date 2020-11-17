"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MariaDbConnection_1 = require("../connections/MariaDbConnection");
const AbstractSqlDriver_1 = require("./AbstractSqlDriver");
const MySqlPlatform_1 = require("../platforms/MySqlPlatform");
class MariaDbDriver extends AbstractSqlDriver_1.AbstractSqlDriver {
    constructor(config) {
        super(config, new MySqlPlatform_1.MySqlPlatform(), MariaDbConnection_1.MariaDbConnection, ['knex', 'mariadb']);
    }
}
exports.MariaDbDriver = MariaDbDriver;
