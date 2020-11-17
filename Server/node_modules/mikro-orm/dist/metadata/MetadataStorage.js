"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const entity_1 = require("../entity");
class MetadataStorage {
    constructor(metadata = {}) {
        this.metadata = utils_1.Utils.copy(metadata);
    }
    static getMetadata(entity) {
        if (entity && !MetadataStorage.metadata[entity]) {
            MetadataStorage.metadata[entity] = { className: entity, properties: {}, hooks: {}, indexes: [], uniques: [] };
        }
        if (entity) {
            return MetadataStorage.metadata[entity];
        }
        return MetadataStorage.metadata;
    }
    static init() {
        return new MetadataStorage(MetadataStorage.metadata);
    }
    getAll() {
        return this.metadata;
    }
    get(entity, init = false, validate = true) {
        if (entity && !this.metadata[entity] && validate && !init) {
            throw utils_1.ValidationError.missingMetadata(entity);
        }
        if (!this.metadata[entity] && init) {
            this.metadata[entity] = { properties: {}, hooks: {}, indexes: [], uniques: [] };
        }
        return this.metadata[entity];
    }
    has(entity) {
        return entity in this.metadata;
    }
    set(entity, meta) {
        return this.metadata[entity] = meta;
    }
    reset(entity) {
        delete this.metadata[entity];
    }
    decorate(em) {
        Object.values(this.metadata)
            .filter(meta => meta.prototype && !utils_1.Utils.isEntity(meta.prototype))
            .forEach(meta => entity_1.EntityHelper.decorate(meta, em));
    }
}
exports.MetadataStorage = MetadataStorage;
MetadataStorage.metadata = {};
