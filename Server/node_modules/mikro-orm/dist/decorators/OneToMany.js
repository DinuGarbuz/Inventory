"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const entity_1 = require("../entity");
function OneToMany(entity, mappedBy, options = {}) {
    return createOneToDecorator(entity, mappedBy, options, entity_1.ReferenceType.ONE_TO_MANY);
}
exports.OneToMany = OneToMany;
function createOneToDecorator(entity, mappedBy, options, reference) {
    return function (target, propertyName) {
        options = utils_1.Utils.isObject(entity) ? entity : Object.assign(Object.assign({}, options), { entity, mappedBy });
        const meta = metadata_1.MetadataStorage.getMetadata(target.constructor.name);
        entity_1.EntityValidator.validateSingleDecorator(meta, propertyName);
        utils_1.Utils.lookupPathFromDecorator(meta);
        if (reference === entity_1.ReferenceType.ONE_TO_MANY) {
            if (options.fk) {
                throw new Error(`@OneToMany({ fk })' is deprecated, use 'mappedBy' instead in '${target.constructor.name}.${propertyName}'`);
            }
        }
        const prop = { name: propertyName, reference };
        Object.assign(prop, options);
        meta.properties[propertyName] = prop;
    };
}
exports.createOneToDecorator = createOneToDecorator;
