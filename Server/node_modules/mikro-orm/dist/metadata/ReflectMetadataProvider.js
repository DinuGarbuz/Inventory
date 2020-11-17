"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const MetadataProvider_1 = require("./MetadataProvider");
const entity_1 = require("../entity");
class ReflectMetadataProvider extends MetadataProvider_1.MetadataProvider {
    async loadEntityMetadata(meta, name) {
        await this.initProperties(meta, prop => this.initPropertyType(meta, prop));
    }
    initPropertyType(meta, prop) {
        const type = Reflect.getMetadata('design:type', meta.prototype, prop.name);
        if (!type || (type === Object && prop.reference !== entity_1.ReferenceType.SCALAR)) {
            throw new Error(`Please provide either 'type' or 'entity' attribute in ${meta.className}.${prop.name}`);
        }
        prop.type = type.name;
        if (['string', 'number', 'boolean', 'array', 'object'].includes(prop.type.toLowerCase())) {
            prop.type = prop.type.toLowerCase();
        }
    }
}
exports.ReflectMetadataProvider = ReflectMetadataProvider;
