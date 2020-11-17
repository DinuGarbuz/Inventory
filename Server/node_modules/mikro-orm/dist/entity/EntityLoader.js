"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const utils_1 = require("../utils");
const Collection_1 = require("./Collection");
const query_1 = require("../query");
const Reference_1 = require("./Reference");
const EntityHelper_1 = require("./EntityHelper");
class EntityLoader {
    constructor(em) {
        this.em = em;
        this.metadata = this.em.getMetadata();
        this.driver = this.em.getDriver();
    }
    async populate(entityName, entities, populate, where = {}, orderBy = {}, refresh = false, validate = true, lookup = true) {
        if (entities.length === 0 || populate === false) {
            return;
        }
        populate = this.normalizePopulate(entityName, populate, lookup);
        const invalid = populate.find(field => !this.em.canPopulate(entityName, field));
        if (validate && invalid) {
            throw utils_1.ValidationError.invalidPropertyName(entityName, invalid);
        }
        for (const field of populate) {
            await this.populateField(entityName, entities, field, where, orderBy, refresh);
        }
    }
    normalizePopulate(entityName, populate, lookup) {
        if (populate === true) {
            populate = this.lookupAllRelationships(entityName);
        }
        else {
            populate = utils_1.Utils.asArray(populate);
        }
        if (lookup) {
            populate = this.lookupEagerLoadedRelationships(entityName, populate);
        }
        return populate;
    }
    /**
     * preload everything in one call (this will update already existing references in IM)
     */
    async populateMany(entityName, entities, field, where, orderBy, refresh) {
        // set populate flag
        entities.forEach(entity => {
            if (utils_1.Utils.isEntity(entity[field], true) || entity[field] instanceof Collection_1.Collection) {
                EntityHelper_1.wrap(entity[field]).populated();
            }
        });
        const prop = this.metadata.get(entityName).properties[field];
        const filtered = this.filterCollections(entities, field, refresh);
        const innerOrderBy = utils_1.Utils.isObject(orderBy[prop.name]) ? orderBy[prop.name] : undefined;
        if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && this.driver.getPlatform().usesPivotTable()) {
            return this.findChildrenFromPivotTable(filtered, prop, field, refresh, where[prop.name], innerOrderBy);
        }
        const subCond = utils_1.Utils.isPlainObject(where[prop.name]) ? where[prop.name] : {};
        const data = await this.findChildren(entities, prop, refresh, subCond, innerOrderBy);
        this.initializeCollections(filtered, prop, field, data);
        return data;
    }
    initializeCollections(filtered, prop, field, children) {
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            this.initializeOneToMany(filtered, children, prop, field);
        }
        if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && !prop.owner && !this.driver.getPlatform().usesPivotTable()) {
            this.initializeManyToMany(filtered, children, prop, field);
        }
    }
    initializeOneToMany(filtered, children, prop, field) {
        for (const entity of filtered) {
            const items = children.filter(child => utils_1.Utils.unwrapReference(child[prop.mappedBy]) === entity);
            entity[field].hydrate(items);
        }
    }
    initializeManyToMany(filtered, children, prop, field) {
        for (const entity of filtered) {
            const items = children.filter(child => child[prop.mappedBy].contains(entity));
            entity[field].hydrate(items);
        }
    }
    async findChildren(entities, prop, refresh, where, orderBy) {
        const children = this.getChildReferences(entities, prop, refresh);
        const meta = this.metadata.get(prop.type);
        let fk = utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys);
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY || (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && !prop.owner)) {
            fk = meta.properties[prop.mappedBy].name;
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && !prop.owner && !this.em.config.get('autoJoinOneToOneOwner')) {
            children.length = 0;
            children.push(...entities);
            fk = meta.properties[prop.mappedBy].name;
        }
        if (children.length === 0) {
            return [];
        }
        const ids = utils_1.Utils.unique(children.map(e => utils_1.Utils.getPrimaryKeyValues(e, EntityHelper_1.wrap(e).__meta.primaryKeys, true)));
        where = Object.assign({ [fk]: { $in: ids } }, where);
        orderBy = orderBy || prop.orderBy || { [fk]: query_1.QueryOrder.ASC };
        return this.em.find(prop.type, where, { orderBy, refresh });
    }
    async populateField(entityName, entities, field, where, orderBy, refresh) {
        if (!field.includes('.')) {
            return void await this.populateMany(entityName, entities, field, where, orderBy, refresh);
        }
        // nested populate
        const [f, ...parts] = field.split('.');
        await this.populateMany(entityName, entities, f, where, orderBy, refresh);
        const children = [];
        for (const entity of entities) {
            if (utils_1.Utils.isEntity(entity[f])) {
                children.push(entity[f]);
            }
            else if (entity[f] instanceof Reference_1.Reference) {
                children.push(entity[f].unwrap());
            }
            else if (entity[f] instanceof Collection_1.Collection) {
                children.push(...entity[f].getItems());
            }
        }
        const filtered = utils_1.Utils.unique(children);
        const prop = this.metadata.get(entityName).properties[f];
        await this.populate(prop.type, filtered, [parts.join('.')], where[prop.name], orderBy[prop.name], refresh, false, false);
    }
    async findChildrenFromPivotTable(filtered, prop, field, refresh, where, orderBy) {
        const map = await this.driver.loadFromPivotTable(prop, filtered.map(e => EntityHelper_1.wrap(e).__primaryKeys), where, orderBy, this.em.getTransactionContext());
        const children = [];
        for (const entity of filtered) {
            const items = map[EntityHelper_1.wrap(entity).__serializedPrimaryKey].map(item => this.em.merge(prop.type, item, refresh));
            entity[field].hydrate(items);
            children.push(...items);
        }
        return children;
    }
    getChildReferences(entities, prop, refresh) {
        const filtered = this.filterCollections(entities, prop.name, refresh);
        const children = [];
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            children.push(...filtered.map(e => e[prop.name].owner));
        }
        else if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && prop.owner) {
            children.push(...filtered.reduce((a, b) => [...a, ...b[prop.name].getItems()], []));
        }
        else if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY) { // inversed side
            children.push(...filtered);
        }
        else { // MANY_TO_ONE or ONE_TO_ONE
            children.push(...this.filterReferences(entities, prop.name, refresh));
        }
        return children;
    }
    filterCollections(entities, field, refresh) {
        if (refresh) {
            return entities.filter(e => e[field]);
        }
        return entities.filter(e => e[field] && !e[field].isInitialized(true));
    }
    filterReferences(entities, field, refresh) {
        const children = entities.filter(e => utils_1.Utils.isEntity(e[field], true));
        if (refresh) {
            return children.map(e => utils_1.Utils.unwrapReference(e[field]));
        }
        return children.filter(e => !e[field].isInitialized()).map(e => utils_1.Utils.unwrapReference(e[field]));
    }
    lookupAllRelationships(entityName, prefix = '', visited = []) {
        if (visited.includes(entityName)) {
            return [];
        }
        visited.push(entityName);
        const ret = [];
        const meta = this.metadata.get(entityName);
        Object.values(meta.properties)
            .filter(prop => prop.reference !== enums_1.ReferenceType.SCALAR)
            .forEach(prop => {
            const prefixed = prefix ? `${prefix}.${prop.name}` : prop.name;
            const nested = this.lookupAllRelationships(prop.type, prefixed, visited);
            if (nested.length > 0) {
                ret.push(...nested);
            }
            else {
                ret.push(prefixed);
            }
        });
        return ret;
    }
    lookupEagerLoadedRelationships(entityName, populate, prefix = '', visited = []) {
        if (visited.includes(entityName)) {
            return [];
        }
        visited.push(entityName);
        const meta = this.metadata.get(entityName);
        Object.values(meta.properties)
            .filter(prop => prop.eager)
            .forEach(prop => {
            const prefixed = prefix ? `${prefix}.${prop.name}` : prop.name;
            const nested = this.lookupEagerLoadedRelationships(prop.type, [], prefixed, visited);
            if (nested.length > 0) {
                populate.push(...nested);
            }
            else {
                populate.push(prefixed);
            }
        });
        return populate;
    }
}
exports.EntityLoader = EntityLoader;
