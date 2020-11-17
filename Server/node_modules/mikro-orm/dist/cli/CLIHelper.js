"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const fs_extra_1 = require("fs-extra");
const cli_table3_1 = __importDefault(require("cli-table3"));
const cli_highlight_1 = __importDefault(require("cli-highlight"));
const chalk_1 = __importDefault(require("chalk"));
const MikroORM_1 = require("../MikroORM");
const utils_1 = require("../utils");
const ClearCacheCommand_1 = require("./ClearCacheCommand");
const GenerateEntitiesCommand_1 = require("./GenerateEntitiesCommand");
const SchemaCommandFactory_1 = require("./SchemaCommandFactory");
const MigrationCommandFactory_1 = require("./MigrationCommandFactory");
const DebugCommand_1 = require("./DebugCommand");
const GenerateCacheCommand_1 = require("./GenerateCacheCommand");
const ImportCommand_1 = require("./ImportCommand");
class CLIHelper {
    static async getConfiguration(validate = true, options = {}) {
        const paths = await CLIHelper.getConfigPaths();
        for (let path of paths) {
            path = utils_1.Utils.absolutePath(path);
            path = utils_1.Utils.normalizePath(path);
            if (await fs_extra_1.pathExists(path)) {
                const config = require(path);
                return new utils_1.Configuration(Object.assign(Object.assign({}, (config.default || config)), options), validate);
            }
        }
        throw new Error(`MikroORM config file not found in ['${paths.join(`', '`)}']`);
    }
    static async getORM(warnWhenNoEntities, opts = {}) {
        const options = await CLIHelper.getConfiguration(warnWhenNoEntities, opts);
        const settings = await CLIHelper.getSettings();
        options.getLogger().setDebugMode(false);
        if (settings.useTsNode) {
            options.set('tsNode', true);
        }
        if (utils_1.Utils.isDefined(warnWhenNoEntities)) {
            options.get('discovery').warnWhenNoEntities = warnWhenNoEntities;
        }
        return MikroORM_1.MikroORM.init(options);
    }
    static async configure() {
        const settings = await CLIHelper.getSettings();
        if (settings.useTsNode) {
            require('ts-node').register({
                project: settings.tsConfigPath,
            });
        }
        // noinspection HtmlDeprecatedTag
        return yargs_1.default
            .scriptName('mikro-orm')
            .version(CLIHelper.getORMVersion())
            .usage('Usage: $0 <command> [options]')
            .example('$0 schema:update --run', 'Runs schema synchronization')
            .alias('v', 'version')
            .alias('h', 'help')
            .command(new ClearCacheCommand_1.ClearCacheCommand())
            .command(new GenerateCacheCommand_1.GenerateCacheCommand())
            .command(new GenerateEntitiesCommand_1.GenerateEntitiesCommand())
            .command(new ImportCommand_1.ImportCommand())
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('create'))
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('drop'))
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('update'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('create'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('up'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('down'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('list'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('pending'))
            .command(new DebugCommand_1.DebugCommand())
            .recommendCommands()
            .strict();
    }
    static getORMVersion() {
        return require('../../package.json').version;
    }
    static getNodeVersion() {
        return process.versions.node;
    }
    static async getDriverDependencies() {
        try {
            const config = await CLIHelper.getConfiguration();
            return config.getDriver().getDependencies();
        }
        catch (_a) {
            return [];
        }
    }
    static async getPackageConfig() {
        if (await fs_extra_1.pathExists(process.cwd() + '/package.json')) {
            return require(process.cwd() + '/package.json');
        }
        return {};
    }
    static async getSettings() {
        const config = await CLIHelper.getPackageConfig();
        return config['mikro-orm'] || {};
    }
    static dump(text, config, language) {
        if (config && language && config.get('highlight')) {
            text = cli_highlight_1.default(text, { language, ignoreIllegals: true, theme: config.getHighlightTheme() });
        }
        // tslint:disable-next-line:no-console
        console.log(text);
    }
    static async getConfigPaths() {
        const paths = [];
        const settings = await CLIHelper.getSettings();
        if (process.env.MIKRO_ORM_CLI) {
            paths.push(process.env.MIKRO_ORM_CLI);
        }
        paths.push(...(settings.configPaths || []));
        if (settings.useTsNode) {
            paths.push('./mikro-orm.config.ts');
        }
        paths.push('./mikro-orm.config.js');
        return paths;
    }
    static async dumpDependencies() {
        CLIHelper.dump(' - dependencies:');
        CLIHelper.dump(`   - mikro-orm ${chalk_1.default.green(CLIHelper.getORMVersion())}`);
        CLIHelper.dump(`   - node ${chalk_1.default.green(CLIHelper.getNodeVersion())}`);
        if (await fs_extra_1.pathExists(process.cwd() + '/package.json')) {
            const drivers = await CLIHelper.getDriverDependencies();
            for (const driver of drivers) {
                CLIHelper.dump(`   - ${driver} ${await CLIHelper.getModuleVersion(driver)}`);
            }
            CLIHelper.dump(`   - typescript ${await CLIHelper.getModuleVersion('typescript')}`);
            CLIHelper.dump(' - package.json ' + chalk_1.default.green('found'));
        }
        else {
            CLIHelper.dump(' - package.json ' + chalk_1.default.red('not found'));
        }
    }
    static async getModuleVersion(name) {
        const path = process.cwd() + '/node_modules/' + name + '/package.json';
        if (await fs_extra_1.pathExists(path)) {
            const pkg = require(path);
            return chalk_1.default.green(pkg.version);
        }
        return chalk_1.default.red('not-found');
    }
    static dumpTable(options) {
        if (options.rows.length === 0) {
            return CLIHelper.dump(options.empty);
        }
        const table = new cli_table3_1.default({ head: options.columns, style: { compact: true } });
        table.push(...options.rows);
        CLIHelper.dump(table.toString());
    }
}
exports.CLIHelper = CLIHelper;
