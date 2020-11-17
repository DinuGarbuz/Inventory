"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const entity_1 = require("../entity");
const utils_1 = require("../utils");
function createDecorator(options, serialized) {
    return function (target, propertyName) {
        const meta = metadata_1.MetadataStorage.getMetadata(target.constructor.name);
        utils_1.Utils.lookupPathFromDecorator(meta);
        const k = serialized ? 'serializedPrimaryKey' : 'primary';
        options[k] = true;
        meta.properties[propertyName] = Object.assign({ name: propertyName, reference: entity_1.ReferenceType.SCALAR }, options);
    };
}
function PrimaryKey(options = {}) {
    return createDecorator(options, false);
}
exports.PrimaryKey = PrimaryKey;
function SerializedPrimaryKey(options = {}) {
    return createDecorator(options, true);
}
exports.SerializedPrimaryKey = SerializedPrimaryKey;
