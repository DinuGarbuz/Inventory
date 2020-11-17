"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const EntityManager_1 = require("./EntityManager");
const drivers_1 = require("./drivers");
const metadata_1 = require("./metadata");
const utils_1 = require("./utils");
const schema_1 = require("./schema");
const EntityGenerator_1 = require("./schema/EntityGenerator");
const migrations_1 = require("./migrations");
const cache_1 = require("./cache");
const CLIHelper_1 = require("./cli/CLIHelper");
/**
 * Helper class for bootstrapping the MikroORM.
 */
class MikroORM {
    constructor(options) {
        if (options instanceof utils_1.Configuration) {
            this.config = options;
        }
        else {
            this.config = new utils_1.Configuration(options);
        }
        if (this.config.get('discovery').disableDynamicFileAccess) {
            this.config.set('metadataProvider', metadata_1.ReflectMetadataProvider);
            this.config.set('cache', { adapter: cache_1.NullCacheAdapter });
            this.config.set('discovery', { disableDynamicFileAccess: true, requireEntitiesArray: true, alwaysAnalyseProperties: false });
        }
        this.driver = this.config.getDriver();
        this.logger = this.config.getLogger();
    }
    /**
     * Initialize the ORM, load entity metadata, create EntityManager and connect to the database.
     * If you omit the `options` parameter, your CLI config will be used.
     */
    static async init(options) {
        if (!options) {
            options = await CLIHelper_1.CLIHelper.getConfiguration();
        }
        const orm = new MikroORM(options);
        const discovery = new metadata_1.MetadataDiscovery(metadata_1.MetadataStorage.init(), orm.driver.getPlatform(), orm.config);
        orm.metadata = await discovery.discover();
        orm.em = new EntityManager_1.EntityManager(orm.config, orm.driver, orm.metadata);
        orm.metadata.decorate(orm.em);
        orm.driver.setMetadata(orm.metadata);
        await orm.connect();
        if (orm.config.get('ensureIndexes')) {
            await orm.driver.ensureIndexes();
        }
        return orm;
    }
    /**
     * Connects to the database.
     */
    async connect() {
        const connection = await this.driver.connect();
        const clientUrl = connection.getClientUrl();
        const dbName = this.config.get('dbName');
        const db = dbName + (clientUrl ? ' on ' + clientUrl : '');
        if (await this.isConnected()) {
            this.logger.log('info', `MikroORM successfully connected to database ${chalk_1.default.green(db)}`);
        }
        else {
            this.logger.log('info', chalk_1.default.red(`MikroORM failed to connect to database ${db}`));
        }
        return this.driver;
    }
    /**
     * Checks whether the database connection is active.
     */
    async isConnected() {
        return this.driver.getConnection().isConnected();
    }
    /**
     * Closes the database connection.
     */
    async close(force = false) {
        return this.driver.close(force);
    }
    /**
     * Gets the MetadataStorage.
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the SchemaGenerator.
     */
    getSchemaGenerator() {
        const driver = this.driver;
        if (!(driver instanceof drivers_1.AbstractSqlDriver)) {
            throw new Error('Not supported by given driver');
        }
        return new schema_1.SchemaGenerator(driver, this.metadata, this.config);
    }
    /**
     * Gets the EntityGenerator.
     */
    getEntityGenerator() {
        const driver = this.driver;
        if (!(driver instanceof drivers_1.AbstractSqlDriver)) {
            throw new Error('Not supported by given driver');
        }
        return new EntityGenerator_1.EntityGenerator(driver, this.config);
    }
    /**
     * Gets the Migrator.
     */
    getMigrator() {
        const driver = this.driver;
        if (!(driver instanceof drivers_1.AbstractSqlDriver)) {
            throw new Error('Not supported by given driver');
        }
        return new migrations_1.Migrator(driver, this.getSchemaGenerator(), this.config);
    }
}
exports.MikroORM = MikroORM;
