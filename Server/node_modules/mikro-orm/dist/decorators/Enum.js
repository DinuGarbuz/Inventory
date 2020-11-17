"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const entity_1 = require("../entity");
const utils_1 = require("../utils");
function Enum(options = {}) {
    return function (target, propertyName) {
        const meta = metadata_1.MetadataStorage.getMetadata(target.constructor.name);
        options = options instanceof Function ? { items: options } : options;
        meta.properties[propertyName] = Object.assign({ name: propertyName, reference: entity_1.ReferenceType.SCALAR, enum: true }, options);
        utils_1.Utils.lookupPathFromDecorator(meta);
    };
}
exports.Enum = Enum;
