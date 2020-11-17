"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const EntityFactory_1 = require("./EntityFactory");
const utils_1 = require("../utils");
const enums_1 = require("./enums");
const Reference_1 = require("./Reference");
const EntityHelper_1 = require("./EntityHelper");
class EntityAssigner {
    static assign(entity, data, onlyProperties = false) {
        const options = (typeof onlyProperties === 'boolean' ? { onlyProperties } : onlyProperties);
        const em = options.em || EntityHelper_1.wrap(entity).__em;
        const meta = EntityHelper_1.wrap(entity).__internal.metadata.get(entity.constructor.name);
        const validator = EntityHelper_1.wrap(entity).__internal.validator;
        const platform = EntityHelper_1.wrap(entity).__internal.platform;
        const props = meta.properties;
        Object.keys(data).forEach(prop => {
            if (options.onlyProperties && !(prop in props)) {
                return;
            }
            let value = data[prop];
            if (props[prop] && props[prop].customType && !utils_1.Utils.isEntity(data)) {
                value = props[prop].customType.convertToJSValue(value, platform);
            }
            if (props[prop] && [enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(props[prop].reference) && utils_1.Utils.isDefined(value, true) && EntityAssigner.validateEM(em)) {
                return EntityAssigner.assignReference(entity, value, props[prop], em);
            }
            if (props[prop] && utils_1.Utils.isCollection(entity[prop], props[prop]) && Array.isArray(value) && EntityAssigner.validateEM(em)) {
                return EntityAssigner.assignCollection(entity, entity[prop], value, props[prop], em);
            }
            if (props[prop] && props[prop].reference === enums_1.ReferenceType.SCALAR && EntityFactory_1.SCALAR_TYPES.includes(props[prop].type) && (!props[prop].getter || props[prop].setter)) {
                return entity[prop] = validator.validateProperty(props[prop], value, entity);
            }
            if (options.mergeObjects && utils_1.Utils.isObject(value)) {
                utils_1.Utils.merge(entity[prop], value);
            }
            else if (!props[prop] || !props[prop].getter || props[prop].setter) {
                entity[prop] = value;
            }
        });
        return entity;
    }
    /**
     * auto-wire 1:1 inverse side with owner as in no-sql drivers it can't be joined
     * also makes sure the link is bidirectional when creating new entities from nested structures
     * @internal
     */
    static autoWireOneToOne(prop, entity) {
        if (prop.reference !== enums_1.ReferenceType.ONE_TO_ONE) {
            return;
        }
        const meta2 = entity[prop.name].__meta;
        const prop2 = meta2.properties[prop.inversedBy || prop.mappedBy];
        if (prop2 && !entity[prop.name][prop2.name]) {
            if (entity[prop.name] instanceof Reference_1.Reference) {
                entity[prop.name].unwrap()[prop2.name] = utils_1.Utils.wrapReference(entity, prop2);
            }
            else {
                entity[prop.name][prop2.name] = utils_1.Utils.wrapReference(entity, prop2);
            }
        }
    }
    static validateEM(em) {
        if (!em) {
            throw new Error(`To use assign() on not managed entities, explicitly provide EM instance: wrap(entity).assign(data, { em: orm.em })`);
        }
        return true;
    }
    static assignReference(entity, value, prop, em) {
        let valid = false;
        if (utils_1.Utils.isEntity(value, true)) {
            entity[prop.name] = value;
            valid = true;
        }
        else if (utils_1.Utils.isPrimaryKey(value, true)) {
            entity[prop.name] = utils_1.Utils.wrapReference(em.getReference(prop.type, value), prop);
            valid = true;
        }
        else if (utils_1.Utils.isObject(value)) {
            entity[prop.name] = utils_1.Utils.wrapReference(em.create(prop.type, value), prop);
            valid = true;
        }
        if (!valid) {
            const name = entity.constructor.name;
            throw new Error(`Invalid reference value provided for '${name}.${prop.name}' in ${name}.assign(): ${JSON.stringify(value)}`);
        }
        EntityAssigner.autoWireOneToOne(prop, entity);
    }
    static assignCollection(entity, collection, value, prop, em) {
        const invalid = [];
        const items = value.map((item) => this.createCollectionItem(item, em, prop, invalid));
        if (invalid.length > 0) {
            const name = entity.constructor.name;
            throw new Error(`Invalid collection values provided for '${name}.${prop.name}' in ${name}.assign(): ${util_1.inspect(invalid)}`);
        }
        collection.hydrate(items, true, false);
        collection.setDirty();
    }
    static createCollectionItem(item, em, prop, invalid) {
        if (utils_1.Utils.isEntity(item)) {
            return item;
        }
        if (utils_1.Utils.isPrimaryKey(item)) {
            return em.getReference(prop.type, item);
        }
        if (utils_1.Utils.isObject(item)) {
            return em.create(prop.type, item);
        }
        invalid.push(item);
        return item;
    }
}
exports.EntityAssigner = EntityAssigner;
