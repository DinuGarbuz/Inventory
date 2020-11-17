"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const DatabaseDriver_1 = require("./DatabaseDriver");
const MongoConnection_1 = require("../connections/MongoConnection");
const utils_1 = require("../utils");
const MongoPlatform_1 = require("../platforms/MongoPlatform");
const entity_1 = require("../entity");
class MongoDriver extends DatabaseDriver_1.DatabaseDriver {
    constructor(config) {
        super(config, ['mongodb']);
        this.connection = new MongoConnection_1.MongoConnection(this.config);
        this.platform = new MongoPlatform_1.MongoPlatform();
    }
    async find(entityName, where, options, ctx) {
        where = this.renameFields(entityName, where);
        const res = await this.getConnection('read').find(entityName, where, options.orderBy, options.limit, options.offset, options.fields, ctx);
        return res.map((r) => this.mapResult(r, this.metadata.get(entityName)));
    }
    async findOne(entityName, where, options = { populate: [], orderBy: {} }, ctx) {
        if (utils_1.Utils.isPrimaryKey(where)) {
            where = { _id: new mongodb_1.ObjectId(where) };
        }
        where = this.renameFields(entityName, where);
        const res = await this.getConnection('read').find(entityName, where, options.orderBy, 1, undefined, options.fields, ctx);
        return this.mapResult(res[0], this.metadata.get(entityName));
    }
    async count(entityName, where, ctx) {
        where = this.renameFields(entityName, where);
        return this.getConnection('read').countDocuments(entityName, where, ctx);
    }
    async nativeInsert(entityName, data, ctx) {
        data = this.renameFields(entityName, data);
        return this.getConnection('write').insertOne(entityName, data, ctx);
    }
    async nativeUpdate(entityName, where, data, ctx) {
        if (utils_1.Utils.isPrimaryKey(where)) {
            where = { _id: new mongodb_1.ObjectId(where) };
        }
        where = this.renameFields(entityName, where);
        data = this.renameFields(entityName, data);
        return this.getConnection('write').updateMany(entityName, where, data, ctx);
    }
    async nativeDelete(entityName, where, ctx) {
        if (utils_1.Utils.isPrimaryKey(where)) {
            where = { _id: new mongodb_1.ObjectId(where) };
        }
        where = this.renameFields(entityName, where);
        return this.getConnection('write').deleteMany(entityName, where, ctx);
    }
    async aggregate(entityName, pipeline, ctx) {
        return this.getConnection('read').aggregate(entityName, pipeline, ctx);
    }
    async createCollections() {
        const promises = Object.values(this.metadata.getAll())
            .map(meta => this.getConnection('write').createCollection(meta.collection));
        await Promise.all(promises);
    }
    async dropCollections() {
        const db = this.getConnection('write').getDb();
        const collections = await db.listCollections().toArray();
        const existing = collections.map(c => c.name);
        const promises = Object.values(this.metadata.getAll())
            .filter(meta => existing.includes(meta.collection))
            .map(meta => this.getConnection('write').dropCollection(meta.collection));
        await Promise.all(promises);
    }
    async ensureIndexes() {
        await this.createCollections();
        const promises = [];
        for (const meta of Object.values(this.metadata.getAll())) {
            promises.push(...this.createIndexes(meta));
            promises.push(...this.createUniqueIndexes(meta));
            for (const prop of Object.values(meta.properties)) {
                promises.push(...this.createPropertyIndexes(meta, prop, 'index'));
                promises.push(...this.createPropertyIndexes(meta, prop, 'unique'));
            }
        }
        await Promise.all(promises);
    }
    createIndexes(meta) {
        const promises = [];
        meta.indexes.forEach(index => {
            let fieldOrSpec;
            const properties = utils_1.Utils.flatten(utils_1.Utils.asArray(index.properties).map(prop => meta.properties[prop].fieldNames));
            if (index.type === 'text') {
                const spec = {};
                properties.forEach(prop => spec[prop] = 'text');
                fieldOrSpec = spec;
            }
            else {
                fieldOrSpec = properties;
            }
            promises.push(this.getConnection('write').getCollection(meta.name).createIndex(fieldOrSpec, Object.assign({ name: index.name, unique: false }, (index.options || {}))));
        });
        return promises;
    }
    createUniqueIndexes(meta) {
        const promises = [];
        meta.uniques.forEach(index => {
            const properties = utils_1.Utils.flatten(utils_1.Utils.asArray(index.properties).map(prop => meta.properties[prop].fieldNames));
            promises.push(this.getConnection('write').getCollection(meta.name).createIndex(properties, Object.assign({ name: index.name, unique: true }, (index.options || {}))));
        });
        return promises;
    }
    createPropertyIndexes(meta, prop, type) {
        if (!prop[type]) {
            return [];
        }
        return [this.getConnection('write').getCollection(meta.name).createIndex(prop.fieldNames, {
                name: (utils_1.Utils.isString(prop[type]) ? prop[type] : undefined),
                unique: type === 'unique',
                sparse: prop.nullable === true,
            })];
    }
    renameFields(entityName, data) {
        data = Object.assign({}, data); // copy first
        utils_1.Utils.renameKey(data, 'id', '_id');
        const meta = this.metadata.get(entityName, false, false);
        Object.keys(data).forEach(k => {
            if (meta && meta.properties[k]) {
                const prop = meta.properties[k];
                if (prop.fieldNames) {
                    utils_1.Utils.renameKey(data, k, prop.fieldNames[0]);
                }
                let isObjectId;
                if (prop.reference === entity_1.ReferenceType.SCALAR) {
                    isObjectId = prop.type.toLowerCase() === 'objectid';
                }
                else {
                    const meta2 = this.metadata.get(prop.type);
                    const pk = meta2.properties[meta2.primaryKeys[0]];
                    isObjectId = pk.type.toLowerCase() === 'objectid';
                }
                if (isObjectId) {
                    data[k] = this.convertObjectIds(data[k]);
                }
            }
        });
        return data;
    }
    convertObjectIds(data) {
        if (data instanceof mongodb_1.ObjectId) {
            return data;
        }
        if (utils_1.Utils.isString(data) && data.match(/^[0-9a-f]{24}$/i)) {
            return new mongodb_1.ObjectId(data);
        }
        if (Array.isArray(data)) {
            return data.map((item) => this.convertObjectIds(item));
        }
        if (utils_1.Utils.isObject(data)) {
            Object.keys(data).forEach(k => {
                data[k] = this.convertObjectIds(data[k]);
            });
        }
        return data;
    }
}
exports.MongoDriver = MongoDriver;
