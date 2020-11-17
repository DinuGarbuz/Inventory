"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySqlConnection_1 = require("./MySqlConnection");
class MariaDbConnection extends MySqlConnection_1.MySqlConnection {
    async connect() {
        this.client = this.createKnexClient(this.getPatchedDialect());
    }
    getPatchedDialect() {
        const dialect = require('knex/lib/dialects/mysql/index.js');
        dialect.prototype.driverName = 'mariadb';
        dialect.prototype._driver = () => require('mariadb/callback');
        dialect.prototype.validateConnection = (connection) => connection.isValid();
        return dialect;
    }
}
exports.MariaDbConnection = MariaDbConnection;
