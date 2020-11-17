"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractSqlConnection_1 = require("./AbstractSqlConnection");
class MySqlConnection extends AbstractSqlConnection_1.AbstractSqlConnection {
    async connect() {
        this.client = this.createKnexClient('mysql2');
    }
    getDefaultClientUrl() {
        return 'mysql://root@127.0.0.1:3306';
    }
    getConnectionOptions() {
        const ret = super.getConnectionOptions();
        if (this.config.get('multipleStatements')) {
            ret.multipleStatements = this.config.get('multipleStatements');
        }
        if (this.config.get('forceUtcTimezone')) {
            ret.timezone = 'Z';
        }
        if (this.config.get('timezone')) {
            ret.timezone = this.config.get('timezone');
        }
        ret.supportBigNumbers = true;
        return ret;
    }
    transformRawResult(res, method) {
        if (method === 'run' && res[0].constructor.name === 'ResultSetHeader') {
            return {
                insertId: res[0].insertId,
                affectedRows: res[0].affectedRows,
            };
        }
        if (method === 'get') {
            return res[0][0];
        }
        return res[0];
    }
}
exports.MySqlConnection = MySqlConnection;
