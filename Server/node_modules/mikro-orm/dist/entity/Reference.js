"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityHelper_1 = require("./EntityHelper");
class Reference {
    constructor(entity) {
        this.entity = entity;
        this.set(entity);
        const wrapped = EntityHelper_1.wrap(this.entity);
        wrapped.__meta.primaryKeys.forEach(primaryKey => {
            Object.defineProperty(this, primaryKey, {
                get() {
                    return this.entity[primaryKey];
                },
            });
        });
        if (wrapped.__meta.serializedPrimaryKey && wrapped.__meta.primaryKeys[0] !== wrapped.__meta.serializedPrimaryKey) {
            Object.defineProperty(this, wrapped.__meta.serializedPrimaryKey, {
                get() {
                    return EntityHelper_1.wrap(this.entity).__serializedPrimaryKey;
                },
            });
        }
    }
    static create(entity) {
        if (entity instanceof Reference) {
            return entity;
        }
        return new Reference(entity);
    }
    async load() {
        if (this.isInitialized()) {
            return this.entity;
        }
        return EntityHelper_1.wrap(this.entity).init();
    }
    async get(prop) {
        await this.load();
        return this.entity[prop];
    }
    set(entity) {
        if (entity instanceof Reference) {
            entity = entity.unwrap();
        }
        this.entity = entity;
    }
    unwrap() {
        return this.entity;
    }
    getEntity() {
        if (!this.isInitialized()) {
            throw new Error(`Reference<${this.__meta.name}> ${this.__primaryKey} not initialized`);
        }
        return this.entity;
    }
    getProperty(prop) {
        return this.getEntity()[prop];
    }
    isInitialized() {
        return EntityHelper_1.wrap(this.entity).isInitialized();
    }
    populated(populated) {
        EntityHelper_1.wrap(this.entity).populated(populated);
    }
    toJSON(...args) {
        return EntityHelper_1.wrap(this.entity).toJSON(...args);
    }
    get __primaryKey() {
        return EntityHelper_1.wrap(this.entity).__primaryKey;
    }
    get __primaryKeys() {
        return EntityHelper_1.wrap(this.entity).__primaryKeys;
    }
    get __uuid() {
        return EntityHelper_1.wrap(this.entity).__uuid;
    }
    get __em() {
        return EntityHelper_1.wrap(this.entity).__em;
    }
    get __internal() {
        return EntityHelper_1.wrap(this.entity).__internal;
    }
    get __meta() {
        return EntityHelper_1.wrap(this.entity).__meta;
    }
    get __populated() {
        return EntityHelper_1.wrap(this.entity).__populated;
    }
    get __lazyInitialized() {
        return EntityHelper_1.wrap(this.entity).__lazyInitialized;
    }
}
exports.Reference = Reference;
