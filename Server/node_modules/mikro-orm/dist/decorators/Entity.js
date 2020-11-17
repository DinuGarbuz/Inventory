"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
function Entity(options = {}) {
    return function (target) {
        const meta = metadata_1.MetadataStorage.getMetadata(target.name);
        utils_1.Utils.merge(meta, options);
        meta.class = target;
        utils_1.Utils.lookupPathFromDecorator(meta);
        return target;
    };
}
exports.Entity = Entity;
