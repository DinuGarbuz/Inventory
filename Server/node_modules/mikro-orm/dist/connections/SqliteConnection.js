"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const AbstractSqlConnection_1 = require("./AbstractSqlConnection");
class SqliteConnection extends AbstractSqlConnection_1.AbstractSqlConnection {
    async connect() {
        await fs_extra_1.ensureDir(path_1.dirname(this.config.get('dbName')));
        this.client = this.createKnexClient(this.getPatchedDialect());
        await this.client.raw('pragma foreign_keys = on');
    }
    getDefaultClientUrl() {
        return '';
    }
    getClientUrl() {
        return '';
    }
    async loadFile(path) {
        const conn = await this.client.client.acquireConnection();
        await conn.exec((await fs_extra_1.readFile(path)).toString());
        await this.client.client.releaseConnection(conn);
    }
    getKnexOptions(type) {
        return {
            client: type,
            connection: {
                filename: this.config.get('dbName'),
            },
            useNullAsDefault: true,
        };
    }
    transformRawResult(res, method) {
        if (method === 'get') {
            return res[0];
        }
        if (method === 'all') {
            return res;
        }
        return {
            insertId: res.lastID,
            affectedRows: res.changes,
        };
    }
    /**
     * monkey patch knex' sqlite dialect so it returns inserted id when doing raw insert query
     */
    getPatchedDialect() {
        const dialect = require('knex/lib/dialects/sqlite3/index.js');
        const processResponse = dialect.prototype.processResponse;
        dialect.prototype.processResponse = (obj, runner) => {
            if (obj.method === 'raw' && obj.sql.trim().match('^insert into|update|delete')) {
                return obj.context;
            }
            return processResponse(obj, runner);
        };
        dialect.prototype._query = (connection, obj) => {
            const callMethod = this.getCallMethod(obj);
            return new Promise((resolve, reject) => {
                /* istanbul ignore if */
                if (!connection || !connection[callMethod]) {
                    return reject(new Error(`Error calling ${callMethod} on connection.`));
                }
                connection[callMethod](obj.sql, obj.bindings, function (err, response) {
                    if (err) {
                        return reject(err);
                    }
                    obj.response = response;
                    obj.context = this;
                    return resolve(obj);
                });
            });
        };
        return dialect;
    }
    getCallMethod(obj) {
        if (obj.method === 'raw' && obj.sql.trim().match('^insert into|update|delete')) {
            return 'run';
        }
        switch (obj.method) {
            case 'insert':
            case 'update':
            case 'counter':
            case 'del':
                return 'run';
            default:
                return 'all';
        }
    }
}
exports.SqliteConnection = SqliteConnection;
