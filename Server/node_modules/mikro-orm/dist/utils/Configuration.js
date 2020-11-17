"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_highlight_1 = require("cli-highlight");
const cache_1 = require("../cache");
const metadata_1 = require("../metadata");
const entity_1 = require("../entity");
const hydration_1 = require("../hydration");
const utils_1 = require("../utils");
class Configuration {
    constructor(options, validate = true) {
        this.cache = {};
        this.options = utils_1.Utils.merge({}, Configuration.DEFAULTS, options);
        this.options.baseDir = utils_1.Utils.absolutePath(this.options.baseDir);
        if (validate) {
            this.validateOptions();
        }
        this.logger = new utils_1.Logger(this.options.logger, this.options.debug);
        this.driver = this.initDriver();
        this.platform = this.driver.getPlatform();
        this.highlightTheme = cli_highlight_1.fromJson(this.options.highlightTheme);
        this.init();
    }
    /**
     * Gets specific configuration option. Falls back to specified `defaultValue` if provided.
     */
    get(key, defaultValue) {
        return (utils_1.Utils.isDefined(this.options[key]) ? this.options[key] : defaultValue);
    }
    /**
     * Overrides specified configuration value.
     */
    set(key, value) {
        this.options[key] = value;
    }
    /**
     * Gets Logger instance.
     */
    getLogger() {
        return this.logger;
    }
    /**
     * Gets current client URL (connection string).
     */
    getClientUrl(hidePassword = false) {
        if (hidePassword) {
            return this.options.clientUrl.replace(/\/\/([^:]+):(.+)@/, '//$1:*****@');
        }
        return this.options.clientUrl;
    }
    /**
     * Gets current database driver instance.
     */
    getDriver() {
        return this.driver;
    }
    /**
     * Gets instance of NamingStrategy. (cached)
     */
    getNamingStrategy() {
        return this.cached(this.options.namingStrategy || this.platform.getNamingStrategy());
    }
    /**
     * Gets instance of Hydrator. Hydrator cannot be cached as it would have reference to wrong (global) EntityFactory.
     */
    getHydrator(factory, em) {
        return new this.options.hydrator(factory, em);
    }
    /**
     * Gets instance of MetadataProvider. (cached)
     */
    getMetadataProvider() {
        return this.cached(this.options.metadataProvider, this);
    }
    /**
     * Gets instance of CacheAdapter. (cached)
     */
    getCacheAdapter() {
        return this.cached(this.options.cache.adapter, this.options.cache.options, this.options.baseDir, this.options.cache.pretty);
    }
    /**
     * Gets EntityRepository class to be instantiated.
     */
    getRepositoryClass(customRepository) {
        if (customRepository) {
            return customRepository();
        }
        return this.options.entityRepository;
    }
    /**
     * Gets highlight there used when logging SQL.
     */
    getHighlightTheme() {
        return this.highlightTheme;
    }
    init() {
        if (!this.options.cache.enabled) {
            this.options.cache.adapter = cache_1.NullCacheAdapter;
        }
        if (!this.options.clientUrl) {
            this.options.clientUrl = this.driver.getConnection().getDefaultClientUrl();
        }
        if (!('implicitTransactions' in this.options)) {
            this.set('implicitTransactions', this.platform.usesImplicitTransactions());
        }
        const url = this.getClientUrl().match(/:\/\/.+\/([^?]+)/);
        if (url) {
            this.options.dbName = this.get('dbName', url[1]);
        }
        if (this.options.entitiesDirsTs.length === 0) {
            this.options.entitiesDirsTs = this.options.entitiesDirs;
        }
        if (!this.options.charset) {
            this.options.charset = this.platform.getDefaultCharset();
        }
    }
    validateOptions() {
        if (!this.options.dbName && !this.options.clientUrl) {
            throw new Error('No database specified, please fill in `dbName` or `clientUrl` option');
        }
        if (this.options.entities.length === 0 && this.options.entitiesDirs.length === 0 && this.options.discovery.warnWhenNoEntities) {
            throw new Error('No entities found, please use `entities` or `entitiesDirs` option');
        }
        const notDirectory = this.options.entitiesDirs.find(dir => dir.match(/\.[jt]s$/));
        if (notDirectory) {
            throw new Error(`Please provide path to directory in \`entitiesDirs\`, found: '${notDirectory}'`);
        }
    }
    initDriver() {
        if (!this.options.driver) {
            const driver = Configuration.PLATFORMS[this.options.type];
            this.options.driver = require('../drivers/' + driver)[driver];
        }
        return new this.options.driver(this);
    }
    cached(cls, ...args) {
        if (!this.cache[cls.name]) {
            const Class = cls;
            this.cache[cls.name] = new Class(...args);
        }
        return this.cache[cls.name];
    }
}
exports.Configuration = Configuration;
Configuration.DEFAULTS = {
    type: 'mongo',
    pool: {},
    entities: [],
    entitiesDirs: [],
    entitiesDirsTs: [],
    discovery: {
        warnWhenNoEntities: true,
        requireEntitiesArray: false,
        alwaysAnalyseProperties: true,
        disableDynamicFileAccess: false,
        tsConfigPath: process.cwd() + '/tsconfig.json',
    },
    autoFlush: false,
    strict: false,
    // tslint:disable-next-line:no-console
    logger: console.log.bind(console),
    findOneOrFailHandler: (entityName, where) => utils_1.ValidationError.findOneFailed(entityName, where),
    baseDir: process.cwd(),
    entityRepository: entity_1.EntityRepository,
    hydrator: hydration_1.ObjectHydrator,
    autoJoinOneToOneOwner: true,
    propagateToOneOwner: true,
    forceUtcTimezone: false,
    ensureIndexes: false,
    debug: false,
    verbose: false,
    driverOptions: {},
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: './migrations',
        pattern: /^[\w-]+\d+\.ts$/,
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        dropTables: true,
        safe: false,
        emit: 'ts',
    },
    cache: {
        enabled: true,
        pretty: false,
        adapter: cache_1.FileCacheAdapter,
        options: { cacheDir: process.cwd() + '/temp' },
    },
    metadataProvider: metadata_1.TsMorphMetadataProvider,
    highlight: true,
    highlightTheme: {
        keyword: ['white', 'bold'],
        built_in: ['cyan', 'dim'],
        string: ['yellow'],
        literal: 'cyan',
        meta: ['yellow', 'dim'],
    },
};
Configuration.PLATFORMS = {
    mongo: 'MongoDriver',
    mysql: 'MySqlDriver',
    mariadb: 'MariaDbDriver',
    postgresql: 'PostgreSqlDriver',
    sqlite: 'SqliteDriver',
};
