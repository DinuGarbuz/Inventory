"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = __importDefault(require("globby"));
const ts_morph_1 = require("ts-morph");
const MetadataProvider_1 = require("./MetadataProvider");
const utils_1 = require("../utils");
class TsMorphMetadataProvider extends MetadataProvider_1.MetadataProvider {
    constructor() {
        super(...arguments);
        this.project = new ts_morph_1.Project();
    }
    async loadEntityMetadata(meta, name) {
        if (!meta.path) {
            return;
        }
        await this.initProperties(meta);
    }
    async getExistingSourceFile(meta) {
        const path = meta.path.match(/\/[^\/]+$/)[0].replace(/\.js$/, '.ts');
        return this.getSourceFile(path);
    }
    async initProperties(meta) {
        // load types and column names
        for (const prop of Object.values(meta.properties)) {
            const type = this.extractType(prop);
            if (!type || this.config.get('discovery').alwaysAnalyseProperties) {
                await this.initPropertyType(meta, prop);
            }
            prop.type = type || prop.type;
        }
    }
    extractType(prop) {
        if (utils_1.Utils.isString(prop.entity)) {
            return prop.entity;
        }
        if (prop.entity) {
            return utils_1.Utils.className(prop.entity());
        }
        return prop.type;
    }
    async initPropertyType(meta, prop) {
        const { type, optional } = await this.readTypeFromSource(meta, prop);
        prop.type = type;
        if (optional) {
            prop.nullable = true;
        }
        this.processWrapper(prop, 'IdentifiedReference');
        this.processWrapper(prop, 'Collection');
    }
    async readTypeFromSource(meta, prop) {
        const source = await this.getExistingSourceFile(meta);
        const cls = source.getClass(meta.className);
        /* istanbul ignore next */
        if (!cls) {
            throw new Error(`Source class for entity ${meta.className} not found. If you are using webpack, see https://bit.ly/35pPDNn`);
        }
        const properties = cls.getInstanceProperties();
        const property = properties.find(v => v.getName() === prop.name);
        if (!property) {
            return { type: prop.type, optional: prop.nullable };
        }
        const type = property.getType().getText(property);
        const optional = property.hasQuestionToken ? property.hasQuestionToken() : undefined;
        return { type, optional };
    }
    async getSourceFile(file) {
        if (!this.sources) {
            await this.initSourceFiles();
        }
        const source = this.sources.find(s => s.getFilePath().endsWith(file));
        if (!source) {
            throw new Error(`Source file for entity ${file} not found, check your 'entitiesDirsTs' option. If you are using webpack, see https://bit.ly/35pPDNn`);
        }
        return source;
    }
    processWrapper(prop, wrapper) {
        const m = prop.type.match(new RegExp(`^${wrapper}<(\\w+),?.*>$`));
        if (!m) {
            return;
        }
        prop.type = m[1];
        if (wrapper === 'IdentifiedReference') {
            prop.wrappedReference = true;
        }
    }
    async initSourceFiles() {
        const tsDirs = this.config.get('entitiesDirsTs');
        if (tsDirs.length > 0) {
            const dirs = await this.validateDirectories(tsDirs);
            this.sources = this.project.addExistingSourceFiles(dirs);
        }
        else {
            this.sources = this.project.addSourceFilesFromTsConfig(this.config.get('discovery').tsConfigPath);
        }
    }
    async validateDirectories(dirs) {
        const ret = [];
        for (const dir of dirs) {
            const path = utils_1.Utils.normalizePath(this.config.get('baseDir'), dir);
            const files = await globby_1.default(`${path}/*`);
            if (files.length === 0) {
                throw new Error(`Path ${path} does not exist`);
            }
            ret.push(utils_1.Utils.normalizePath(path, '**', '*.ts'));
        }
        return ret;
    }
}
exports.TsMorphMetadataProvider = TsMorphMetadataProvider;
