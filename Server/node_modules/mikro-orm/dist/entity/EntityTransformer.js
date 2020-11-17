"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const ArrayCollection_1 = require("./ArrayCollection");
const Reference_1 = require("./Reference");
const EntityHelper_1 = require("./EntityHelper");
class EntityTransformer {
    static toObject(entity, ignoreFields = [], visited = []) {
        const wrapped = EntityHelper_1.wrap(entity);
        const platform = wrapped.__internal.platform;
        const meta = wrapped.__meta;
        const ret = {};
        meta.primaryKeys
            .filter(pk => !utils_1.Utils.isDefined(entity[pk], true) || !meta.properties[pk].hidden)
            .map(pk => [pk, utils_1.Utils.getPrimaryKeyValue(entity, [pk])])
            .forEach(([pk, value]) => ret[platform.getSerializedPrimaryKeyField(pk)] = platform.normalizePrimaryKey(value));
        if ((!wrapped.isInitialized() && utils_1.Utils.isDefined(wrapped.__primaryKey, true)) || visited.includes(EntityHelper_1.wrap(entity).__uuid)) {
            return ret;
        }
        visited.push(EntityHelper_1.wrap(entity).__uuid);
        // normal properties
        Object.keys(entity)
            .filter(prop => this.isVisible(meta, prop, ignoreFields))
            .map(prop => [prop, EntityTransformer.processProperty(prop, entity, ignoreFields, visited)])
            .filter(([, value]) => typeof value !== 'undefined')
            .forEach(([prop, value]) => ret[prop] = value);
        // decorated getters
        Object.values(meta.properties)
            .filter(prop => prop.getter && !prop.hidden && typeof entity[prop.name] !== 'undefined')
            .forEach(prop => ret[prop.name] = entity[prop.name]);
        // decorated get methods
        Object.values(meta.properties)
            .filter(prop => prop.getterName && !prop.hidden && entity[prop.getterName] instanceof Function)
            .forEach(prop => ret[prop.name] = entity[prop.getterName]());
        return ret;
    }
    static isVisible(meta, prop, ignoreFields) {
        const visible = meta.properties[prop] && !meta.properties[prop].hidden;
        return visible && !meta.primaryKeys.includes(prop) && !prop.startsWith('_') && !ignoreFields.includes(prop);
    }
    static processProperty(prop, entity, ignoreFields, visited) {
        const property = EntityHelper_1.wrap(entity).__meta.properties[prop];
        const platform = EntityHelper_1.wrap(entity).__internal.platform;
        if (property && property.customType) {
            return property.customType.toJSON(entity[prop], platform);
        }
        if (entity[prop] instanceof ArrayCollection_1.ArrayCollection) {
            return EntityTransformer.processCollection(prop, entity);
        }
        if (utils_1.Utils.isEntity(entity[prop]) || entity[prop] instanceof Reference_1.Reference) {
            return EntityTransformer.processEntity(prop, entity, ignoreFields, visited);
        }
        return entity[prop];
    }
    static processEntity(prop, entity, ignoreFields, visited) {
        const child = EntityHelper_1.wrap(entity[prop]);
        if (child.isInitialized() && child.__populated && child !== entity && !child.__lazyInitialized) {
            const args = [...child.__meta.toJsonParams.map(() => undefined), ignoreFields, visited];
            return child.toJSON(...args);
        }
        return child.__internal.platform.normalizePrimaryKey(child.__primaryKey);
    }
    static processCollection(prop, entity) {
        const col = entity[prop];
        if (col.isInitialized(true) && col.shouldPopulate()) {
            return col.toArray();
        }
        if (col.isInitialized()) {
            return col.getIdentifiers();
        }
    }
}
exports.EntityTransformer = EntityTransformer;
