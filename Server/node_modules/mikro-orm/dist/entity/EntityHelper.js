"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const util_1 = require("util");
const EntityTransformer_1 = require("./EntityTransformer");
const EntityAssigner_1 = require("./EntityAssigner");
const Reference_1 = require("./Reference");
const utils_1 = require("../utils");
const enums_1 = require("./enums");
class EntityHelper {
    static async init(entity, populated = true, lockMode) {
        const em = wrap(entity).__em;
        if (!em) {
            throw utils_1.ValidationError.entityNotManaged(entity);
        }
        await em.findOne(entity.constructor.name, entity, { refresh: true, lockMode });
        wrap(entity).populated(populated);
        Object.defineProperty(entity, '__lazyInitialized', { value: true, writable: true });
        return entity;
    }
    static decorate(meta, em) {
        const pk = meta.properties[meta.primaryKeys[0]];
        if (pk.name === '_id') {
            EntityHelper.defineIdProperty(meta, em.getDriver().getPlatform());
        }
        EntityHelper.defineBaseProperties(meta, em);
        EntityHelper.defineBaseHelperMethods(meta);
        EntityHelper.definePrimaryKeyProperties(meta);
        const prototype = meta.prototype;
        if (em.config.get('propagateToOneOwner')) {
            EntityHelper.defineReferenceProperties(meta);
        }
        if (!prototype.assign) { // assign can be overridden
            prototype.assign = function (data, options) {
                return EntityAssigner_1.EntityAssigner.assign(this, data, options);
            };
        }
        if (!prototype.toJSON) { // toJSON can be overridden
            prototype.toJSON = function (...args) {
                return EntityTransformer_1.EntityTransformer.toObject(this, ...args.slice(meta.toJsonParams.length));
            };
        }
    }
    /**
     * defines magic id property getter/setter if PK property is `_id` and there is no `id` property defined
     */
    static defineIdProperty(meta, platform) {
        Object.defineProperty(meta.prototype, 'id', {
            get() {
                return this._id ? platform.normalizePrimaryKey(this._id) : null;
            },
            set(id) {
                this._id = id ? platform.denormalizePrimaryKey(id) : null;
            },
        });
    }
    static defineBaseProperties(meta, em) {
        const internal = {
            platform: em.getDriver().getPlatform(),
            metadata: em.getMetadata(),
            validator: em.getValidator(),
        };
        Object.defineProperties(meta.prototype, {
            __populated: { value: false, writable: true },
            __lazyInitialized: { value: false, writable: true },
            __entity: { value: true },
            __em: { value: undefined, writable: true },
            __meta: { value: meta },
            __internal: { value: internal },
            __uuid: {
                get() {
                    if (!this.___uuid) {
                        Object.defineProperty(this, '___uuid', { value: uuid_1.v4() });
                    }
                    return this.___uuid;
                },
            },
        });
    }
    static defineBaseHelperMethods(meta) {
        const prototype = meta.prototype;
        prototype.isInitialized = function () {
            return this.__initialized !== false;
        };
        prototype.populated = function (populated = true) {
            Object.defineProperty(this, '__populated', { value: populated, writable: true });
        };
        prototype.toReference = function () {
            return Reference_1.Reference.create(this);
        };
        prototype.toObject = function (ignoreFields = []) {
            return EntityTransformer_1.EntityTransformer.toObject(this, ignoreFields);
        };
        prototype.init = function (populated = true) {
            return EntityHelper.init(this, populated);
        };
    }
    static definePrimaryKeyProperties(meta) {
        Object.defineProperties(meta.prototype, {
            __primaryKey: {
                get() {
                    return utils_1.Utils.getPrimaryKeyValue(this, meta.primaryKeys);
                },
                set(id) {
                    this[meta.primaryKeys[0]] = id;
                },
            },
            __primaryKeys: {
                get() {
                    return utils_1.Utils.getPrimaryKeyValues(this, meta.primaryKeys);
                },
            },
            __serializedPrimaryKey: {
                get() {
                    if (meta.compositePK) {
                        return utils_1.Utils.getCompositeKeyHash(this, meta);
                    }
                    if (utils_1.Utils.isEntity(this[meta.serializedPrimaryKey])) {
                        return wrap(this[meta.serializedPrimaryKey]).__serializedPrimaryKey;
                    }
                    return this[meta.serializedPrimaryKey];
                },
            },
        });
    }
    /**
     * Defines getter and setter for every owning side of m:1 and 1:1 relation. This is then used for propagation of
     * changes to the inverse side of bi-directional relations.
     * First defines a setter on the prototype, once called, actual get/set handlers are registered on the instance rather
     * than on its prototype. Thanks to this we still have those properties enumerable (e.g. part of `Object.keys(entity)`).
     */
    static defineReferenceProperties(meta) {
        Object
            .values(meta.properties)
            .filter(prop => [enums_1.ReferenceType.ONE_TO_ONE, enums_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) && (prop.inversedBy || prop.mappedBy))
            .forEach(prop => {
            Object.defineProperty(meta.prototype, prop.name, {
                set(val) {
                    if (!('__data' in this)) {
                        Object.defineProperty(this, '__data', { value: {} });
                    }
                    EntityHelper.defineReferenceProperty(prop, this, val);
                },
            });
        });
        meta.prototype[util_1.inspect.custom] = function (depth) {
            const ret = util_1.inspect(Object.assign({}, this), { depth });
            return ret === '[Object]' ? `[${meta.name}]` : meta.name + ' ' + ret;
        };
    }
    static defineReferenceProperty(prop, ref, val) {
        Object.defineProperty(ref, prop.name, {
            get() {
                return this.__data[prop.name];
            },
            set(val) {
                this.__data[prop.name] = utils_1.Utils.wrapReference(val, prop);
                const entity = utils_1.Utils.unwrapReference(val);
                EntityHelper.propagate(entity, this, prop);
            },
            enumerable: true,
            configurable: true,
        });
        ref[prop.name] = val;
    }
    static propagate(entity, owner, prop) {
        const inverse = entity && entity[prop.inversedBy || prop.mappedBy];
        if (prop.reference === enums_1.ReferenceType.MANY_TO_ONE && inverse && wrap(inverse).isInitialized()) {
            inverse.add(owner);
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && entity && wrap(entity).isInitialized() && utils_1.Utils.unwrapReference(inverse) !== owner) {
            EntityHelper.propagateOneToOne(entity, owner, prop);
        }
    }
    static propagateOneToOne(entity, owner, prop) {
        const inverse = entity[prop.inversedBy || prop.mappedBy];
        if (utils_1.Utils.isReference(inverse)) {
            inverse.set(owner);
        }
        else {
            entity[prop.inversedBy || prop.mappedBy] = utils_1.Utils.wrapReference(owner, prop);
        }
    }
}
exports.EntityHelper = EntityHelper;
/**
 * wraps entity type with AnyEntity internal properties and helpers like init/isInitialized/populated/toJSON
 */
function wrap(entity) {
    return entity;
}
exports.wrap = wrap;
