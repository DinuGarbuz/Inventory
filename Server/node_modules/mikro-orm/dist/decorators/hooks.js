"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../metadata");
function BeforeCreate() {
    return hook('beforeCreate');
}
exports.BeforeCreate = BeforeCreate;
function AfterCreate() {
    return hook('afterCreate');
}
exports.AfterCreate = AfterCreate;
function BeforeUpdate() {
    return hook('beforeUpdate');
}
exports.BeforeUpdate = BeforeUpdate;
function AfterUpdate() {
    return hook('afterUpdate');
}
exports.AfterUpdate = AfterUpdate;
function OnInit() {
    return hook('onInit');
}
exports.OnInit = OnInit;
/**
 * Called before deleting entity, but only when providing initialized entity to EM#remove()
 */
function BeforeDelete() {
    return hook('beforeDelete');
}
exports.BeforeDelete = BeforeDelete;
/**
 * Called after deleting entity, but only when providing initialized entity to EM#remove()
 */
function AfterDelete() {
    return hook('afterDelete');
}
exports.AfterDelete = AfterDelete;
function hook(type) {
    return function (target, method) {
        const meta = metadata_1.MetadataStorage.getMetadata(target.constructor.name);
        if (!meta.hooks[type]) {
            meta.hooks[type] = [];
        }
        meta.hooks[type].push(method);
    };
}
