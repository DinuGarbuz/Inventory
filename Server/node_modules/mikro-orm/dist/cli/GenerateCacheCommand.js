"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const CLIHelper_1 = require("./CLIHelper");
const metadata_1 = require("../metadata");
class GenerateCacheCommand {
    constructor() {
        this.command = 'cache:generate';
        this.describe = 'Generate metadata cache for production';
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const config = await CLIHelper_1.CLIHelper.getConfiguration(false);
        config.set('logger', CLIHelper_1.CLIHelper.dump.bind(null));
        config.set('debug', true);
        const discovery = new metadata_1.MetadataDiscovery(metadata_1.MetadataStorage.init(), config.getDriver().getPlatform(), config);
        await discovery.discover(false);
        CLIHelper_1.CLIHelper.dump(chalk_1.default.green('Metadata cache was successfully generated'));
    }
}
exports.GenerateCacheCommand = GenerateCacheCommand;
