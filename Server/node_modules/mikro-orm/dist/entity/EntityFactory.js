"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const enums_1 = require("./enums");
exports.SCALAR_TYPES = ['string', 'number', 'boolean', 'Date'];
class EntityFactory {
    constructor(unitOfWork, em) {
        this.unitOfWork = unitOfWork;
        this.em = em;
        this.driver = this.em.getDriver();
        this.config = this.em.config;
        this.metadata = this.em.getMetadata();
        this.hydrator = this.config.getHydrator(this, this.em);
    }
    create(entityName, data, initialized = true, newEntity = false) {
        if (utils_1.Utils.isEntity(data)) {
            return data;
        }
        entityName = utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        meta.primaryKeys.forEach(pk => this.denormalizePrimaryKey(data, pk));
        const entity = this.createEntity(data, meta);
        if (initialized && !utils_1.Utils.isEntity(data)) {
            this.hydrator.hydrate(entity, meta, data, newEntity);
        }
        if (initialized) {
            delete entity.__initialized;
        }
        else {
            entity.__initialized = initialized;
        }
        this.runHooks(entity, meta);
        return entity;
    }
    createReference(entityName, id) {
        entityName = utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        if (Array.isArray(id)) {
            id = utils_1.Utils.getPrimaryKeyCondFromArray(id, meta.primaryKeys);
        }
        const pks = utils_1.Utils.getOrderedPrimaryKeys(id, meta);
        if (utils_1.Utils.isPrimaryKey(id)) {
            id = { [meta.primaryKeys[0]]: id };
        }
        if (this.unitOfWork.getById(entityName, pks)) {
            return this.unitOfWork.getById(entityName, pks);
        }
        return this.create(entityName, id, false);
    }
    createEntity(data, meta) {
        const Entity = this.metadata.get(meta.name).class;
        const pks = utils_1.Utils.getOrderedPrimaryKeys(data, meta);
        if (meta.primaryKeys.some(pk => !utils_1.Utils.isDefined(data[pk], true))) {
            const params = this.extractConstructorParams(meta, data);
            meta.constructorParams.forEach(prop => delete data[prop]);
            // creates new instance via constructor as this is the new entity
            return new Entity(...params);
        }
        if (this.unitOfWork.getById(meta.name, pks)) {
            return this.unitOfWork.getById(meta.name, pks);
        }
        // creates new entity instance, bypassing constructor call as its already persisted entity
        const entity = Object.create(Entity.prototype);
        meta.primaryKeys.forEach(pk => {
            const prop = meta.properties[pk];
            if (prop.reference === enums_1.ReferenceType.SCALAR) {
                entity[pk] = data[pk];
            }
            else {
                entity[pk] = this.createReference(prop.type, data[pk]);
            }
        });
        return entity;
    }
    /**
     * denormalize PK to value required by driver (e.g. ObjectId)
     */
    denormalizePrimaryKey(data, primaryKey) {
        const platform = this.driver.getPlatform();
        const pk = platform.getSerializedPrimaryKeyField(primaryKey);
        if (utils_1.Utils.isDefined(data[pk], true) || utils_1.Utils.isDefined(data[primaryKey], true)) {
            const id = platform.denormalizePrimaryKey(data[pk] || data[primaryKey]);
            delete data[pk];
            data[primaryKey] = id;
        }
    }
    /**
     * returns parameters for entity constructor, creating references from plain ids
     */
    extractConstructorParams(meta, data) {
        return meta.constructorParams.map(k => {
            if (meta.properties[k] && [enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(meta.properties[k].reference) && data[k]) {
                const entity = this.unitOfWork.getById(meta.properties[k].type, data[k]);
                if (entity) {
                    return entity;
                }
                if (utils_1.Utils.isEntity(data[k])) {
                    return data[k];
                }
                return this.createReference(meta.properties[k].type, data[k]);
            }
            return data[k];
        });
    }
    runHooks(entity, meta) {
        if (meta.hooks && meta.hooks.onInit && meta.hooks.onInit.length > 0) {
            meta.hooks.onInit.forEach(hook => entity[hook]());
        }
    }
}
exports.EntityFactory = EntityFactory;
