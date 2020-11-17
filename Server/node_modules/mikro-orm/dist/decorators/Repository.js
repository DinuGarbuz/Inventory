"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
function Repository(entity) {
    return function (target) {
        const meta = metadata_1.MetadataStorage.getMetadata(entity.name);
        meta.customRepository = () => target;
    };
}
exports.Repository = Repository;
