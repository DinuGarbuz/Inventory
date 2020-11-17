"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
function createDecorator(options, unique) {
    return function (target, propertyName) {
        const entityName = propertyName ? target.constructor.name : target.name;
        const meta = metadata_1.MetadataStorage.getMetadata(entityName);
        utils_1.Utils.lookupPathFromDecorator(meta);
        options.properties = options.properties || propertyName;
        const key = unique ? 'uniques' : 'indexes';
        meta[key].push(options);
    };
}
function Index(options = {}) {
    return createDecorator(options, false);
}
exports.Index = Index;
function Unique(options = {}) {
    return createDecorator(options, true);
}
exports.Unique = Unique;
