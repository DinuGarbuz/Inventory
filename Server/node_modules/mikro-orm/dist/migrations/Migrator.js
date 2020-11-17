"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const umzug_1 = __importDefault(require("umzug"));
const utils_1 = require("../utils");
const MigrationRunner_1 = require("./MigrationRunner");
const MigrationGenerator_1 = require("./MigrationGenerator");
const MigrationStorage_1 = require("./MigrationStorage");
class Migrator {
    constructor(driver, schemaGenerator, config) {
        this.driver = driver;
        this.schemaGenerator = schemaGenerator;
        this.config = config;
        this.options = this.config.get('migrations');
        this.runner = new MigrationRunner_1.MigrationRunner(this.driver, this.options, this.config);
        this.generator = new MigrationGenerator_1.MigrationGenerator(this.driver, this.options);
        this.storage = new MigrationStorage_1.MigrationStorage(this.driver, this.options);
        this.umzug = new umzug_1.default({
            storage: this.storage,
            logging: this.config.get('logger'),
            migrations: {
                path: utils_1.Utils.absolutePath(this.options.path, this.config.get('baseDir')),
                pattern: this.options.pattern,
                customResolver: file => this.resolve(file),
            },
        });
    }
    async createMigration(path, blank = false) {
        const diff = blank ? ['select 1'] : await this.getSchemaDiff();
        if (diff.length === 0) {
            return { fileName: '', code: '', diff };
        }
        const migration = await this.generator.generate(diff, path);
        return {
            fileName: migration[1],
            code: migration[0],
            diff,
        };
    }
    async getExecutedMigrations() {
        await this.storage.ensureTable();
        return this.storage.getExecutedMigrations();
    }
    async getPendingMigrations() {
        await this.storage.ensureTable();
        return this.umzug.pending();
    }
    async up(options) {
        return this.runMigrations('up', options);
    }
    async down(options) {
        return this.runMigrations('down', options);
    }
    async getSchemaDiff() {
        const dump = await this.schemaGenerator.getUpdateSchemaSQL(false, this.options.safe, this.options.dropTables);
        const lines = dump.split('\n');
        for (let i = lines.length - 1; i > 0; i--) {
            if (lines[i]) {
                break;
            }
            delete lines[i];
        }
        return lines;
    }
    resolve(file) {
        const migration = require(file);
        const MigrationClass = Object.values(migration)[0];
        const instance = new MigrationClass(this.driver.getConnection(), this.config);
        return {
            up: () => this.runner.run(instance, 'up'),
            down: () => this.runner.run(instance, 'down'),
        };
    }
    prefix(options) {
        if (utils_1.Utils.isString(options) || Array.isArray(options)) {
            return utils_1.Utils.asArray(options).map(m => m.startsWith('Migration') ? m : 'Migration' + m);
        }
        if (!utils_1.Utils.isObject(options)) {
            return options;
        }
        if (options.migrations) {
            options.migrations = options.migrations.map(m => this.prefix(m));
        }
        ['from', 'to'].filter(k => options[k]).forEach(k => options[k] = this.prefix(options[k]));
        return options;
    }
    async runMigrations(method, options) {
        await this.storage.ensureTable();
        if (!this.options.transactional || !this.options.allOrNothing) {
            return this.umzug[method](this.prefix(options));
        }
        return this.driver.getConnection().transactional(async (trx) => {
            this.runner.setMasterMigration(trx);
            this.storage.setMasterMigration(trx);
            const ret = await this.umzug[method](this.prefix(options));
            this.runner.unsetMasterMigration();
            this.storage.unsetMasterMigration();
            return ret;
        });
    }
}
exports.Migrator = Migrator;
