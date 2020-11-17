"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const entity_1 = require("../entity");
function ManyToOne(entity = {}, options = {}) {
    return function (target, propertyName) {
        options = utils_1.Utils.isObject(entity) ? entity : Object.assign(Object.assign({}, options), { entity });
        if (options.fk) {
            throw new Error(`@ManyToOne({ fk })' is deprecated, use 'inversedBy' instead in '${target.constructor.name}.${propertyName}'`);
        }
        const meta = metadata_1.MetadataStorage.getMetadata(target.constructor.name);
        entity_1.EntityValidator.validateSingleDecorator(meta, propertyName);
        utils_1.Utils.lookupPathFromDecorator(meta);
        const property = { name: propertyName, reference: entity_1.ReferenceType.MANY_TO_ONE };
        meta.properties[propertyName] = Object.assign(property, options);
    };
}
exports.ManyToOne = ManyToOne;
