"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entity");
const ChangeSet_1 = require("./ChangeSet");
const __1 = require("..");
const utils_1 = require("../utils");
class ChangeSetPersister {
    constructor(driver, identifierMap, metadata) {
        this.driver = driver;
        this.identifierMap = identifierMap;
        this.metadata = metadata;
    }
    async persistToDatabase(changeSet, ctx) {
        const meta = this.metadata.get(changeSet.name);
        // process references first
        for (const prop of Object.values(meta.properties)) {
            this.processReference(changeSet, prop);
        }
        // persist the entity itself
        await this.persistEntity(changeSet, meta, ctx);
    }
    async persistEntity(changeSet, meta, ctx) {
        let res;
        if (changeSet.type === ChangeSet_1.ChangeSetType.DELETE) {
            await this.driver.nativeDelete(changeSet.name, changeSet.entity.__primaryKey, ctx);
        }
        else if (changeSet.type === ChangeSet_1.ChangeSetType.UPDATE) {
            res = await this.updateEntity(meta, changeSet, ctx);
            this.mapReturnedValues(changeSet.entity, res, meta);
        }
        else if (__1.Utils.isDefined(changeSet.entity.__primaryKey, true)) { // ChangeSetType.CREATE with primary key
            res = await this.driver.nativeInsert(changeSet.name, changeSet.payload, ctx);
            this.mapReturnedValues(changeSet.entity, res, meta);
            delete changeSet.entity.__initialized;
        }
        else { // ChangeSetType.CREATE without primary key
            res = await this.driver.nativeInsert(changeSet.name, changeSet.payload, ctx);
            this.mapReturnedValues(changeSet.entity, res, meta);
            this.mapPrimaryKey(meta, res.insertId, changeSet);
            delete changeSet.entity.__initialized;
        }
        await this.processOptimisticLock(meta, changeSet, res, ctx);
        changeSet.persisted = true;
    }
    mapPrimaryKey(meta, value, changeSet) {
        const prop = meta.properties[meta.primaryKeys[0]];
        const insertId = prop.customType ? prop.customType.convertToJSValue(value, this.driver.getPlatform()) : value;
        entity_1.wrap(changeSet.entity).__primaryKey = __1.Utils.isDefined(changeSet.entity.__primaryKey, true) ? changeSet.entity.__primaryKey : insertId;
        this.identifierMap[changeSet.entity.__uuid].setValue(changeSet.entity[prop.name]);
    }
    async updateEntity(meta, changeSet, ctx) {
        if (!meta.versionProperty || !changeSet.entity[meta.versionProperty]) {
            return this.driver.nativeUpdate(changeSet.name, changeSet.entity.__primaryKey, changeSet.payload, ctx);
        }
        const cond = Object.assign(Object.assign({}, __1.Utils.getPrimaryKeyCond(changeSet.entity, meta.primaryKeys)), { [meta.versionProperty]: changeSet.entity[meta.versionProperty] });
        return this.driver.nativeUpdate(changeSet.name, cond, changeSet.payload, ctx);
    }
    async processOptimisticLock(meta, changeSet, res, ctx) {
        if (meta.versionProperty && changeSet.type === ChangeSet_1.ChangeSetType.UPDATE && res && !res.affectedRows) {
            throw utils_1.ValidationError.lockFailed(changeSet.entity);
        }
        if (meta.versionProperty && [ChangeSet_1.ChangeSetType.CREATE, ChangeSet_1.ChangeSetType.UPDATE].includes(changeSet.type)) {
            const e = await this.driver.findOne(meta.name, changeSet.entity.__primaryKey, { populate: [meta.versionProperty] }, ctx);
            changeSet.entity[meta.versionProperty] = e[meta.versionProperty];
        }
    }
    processReference(changeSet, prop) {
        const value = changeSet.payload[prop.name];
        if (value instanceof entity_1.EntityIdentifier) {
            changeSet.payload[prop.name] = value.getValue();
        }
        if (prop.onCreate && changeSet.type === ChangeSet_1.ChangeSetType.CREATE) {
            changeSet.entity[prop.name] = changeSet.payload[prop.name] = prop.onCreate();
            if (prop.primary) {
                this.mapPrimaryKey(changeSet.entity.__meta, changeSet.entity[prop.name], changeSet);
            }
        }
        if (prop.onUpdate && changeSet.type === ChangeSet_1.ChangeSetType.UPDATE) {
            changeSet.entity[prop.name] = changeSet.payload[prop.name] = prop.onUpdate();
        }
    }
    /**
     * Maps values returned via `returning` statement (postgres) or the inserted id (other sql drivers).
     * No need to handle composite keys here as they need to be set upfront.
     */
    mapReturnedValues(entity, res, meta) {
        if (res.row && Object.keys(res.row).length > 0) {
            Object.values(meta.properties).forEach(prop => {
                if (prop.fieldNames && res.row[prop.fieldNames[0]] && !__1.Utils.isDefined(entity[prop.name], true)) {
                    entity[prop.name] = res.row[prop.fieldNames[0]];
                }
            });
        }
    }
}
exports.ChangeSetPersister = ChangeSetPersister;
