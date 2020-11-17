"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class MigrationRunner {
    constructor(driver, options, config) {
        this.driver = driver;
        this.options = options;
        this.config = config;
        this.connection = this.driver.getConnection();
        this.helper = this.driver.getPlatform().getSchemaHelper();
    }
    async run(migration, method) {
        migration.reset();
        await migration[method]();
        let queries = migration.getQueries();
        if (this.options.disableForeignKeys) {
            const charset = this.config.get('charset');
            queries.unshift(...this.helper.getSchemaBeginning(charset).split('\n'));
            queries.push(...this.helper.getSchemaEnd().split('\n'));
        }
        queries = queries.filter(sql => sql.trim().length > 0);
        if (!this.options.transactional || !migration.isTransactional()) {
            await utils_1.Utils.runSerial(queries, sql => this.connection.execute(sql));
            return;
        }
        await this.connection.transactional(async (tx) => {
            await utils_1.Utils.runSerial(queries, sql => this.connection.execute(tx.raw(sql)));
        }, this.masterTransaction);
    }
    setMasterMigration(trx) {
        this.masterTransaction = trx;
    }
    unsetMasterMigration() {
        delete this.masterTransaction;
    }
}
exports.MigrationRunner = MigrationRunner;
