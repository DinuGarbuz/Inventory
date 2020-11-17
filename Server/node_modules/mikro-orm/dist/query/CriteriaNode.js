"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const QueryBuilderHelper_1 = require("./QueryBuilderHelper");
const utils_1 = require("../utils");
const entity_1 = require("../entity");
const enums_1 = require("./enums");
/**
 * Helper for working with deeply nested where/orderBy/having criteria. Uses composite pattern to build tree from the payload.
 * Auto-joins relations and converts payload from { books: { publisher: { name: '...' } } } to { 'publisher_alias.name': '...' }
 */
class CriteriaNode {
    constructor(metadata, entityName, parent, key, validate = true) {
        this.metadata = metadata;
        this.entityName = entityName;
        this.parent = parent;
        this.key = key;
        const meta = parent && metadata.get(parent.entityName, false, false);
        if (meta && key) {
            utils_1.Utils.splitPrimaryKeys(key).forEach(k => {
                this.prop = Object.values(meta.properties).find(prop => prop.name === k || (prop.fieldNames || []).includes(k));
                if (validate && !this.prop && !k.includes('.') && !QueryBuilderHelper_1.QueryBuilderHelper.isOperator(k) && !QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(k)) {
                    throw new Error(`Trying to query by not existing property ${entityName}.${k}`);
                }
            });
        }
    }
    static create(metadata, entityName, payload, parent, key) {
        const customExpression = QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(key || '');
        const scalar = utils_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        if (Array.isArray(payload) && !scalar) {
            return ArrayCriteriaNode.create(metadata, entityName, payload, parent, key);
        }
        if (utils_1.Utils.isObject(payload) && !scalar) {
            return ObjectCriteriaNode.create(metadata, entityName, payload, parent, key);
        }
        return ScalarCriteriaNode.create(metadata, entityName, payload, parent, key);
    }
    process(qb, alias) {
        return this.payload;
    }
    shouldInline(payload) {
        return false;
    }
    shouldRename(payload) {
        const type = this.prop ? this.prop.reference : null;
        const composite = this.prop && this.prop.joinColumns ? this.prop.joinColumns.length > 1 : false;
        const customExpression = QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(this.key);
        const scalar = utils_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        const operator = utils_1.Utils.isObject(payload) && Object.keys(payload).every(k => QueryBuilderHelper_1.QueryBuilderHelper.isOperator(k, false));
        if (composite) {
            return true;
        }
        switch (type) {
            case entity_1.ReferenceType.MANY_TO_ONE: return false;
            case entity_1.ReferenceType.ONE_TO_ONE: return !this.prop.owner && !(this.parent && this.parent.parent);
            case entity_1.ReferenceType.ONE_TO_MANY: return scalar || operator;
            case entity_1.ReferenceType.MANY_TO_MANY: return scalar || operator;
            default: return false;
        }
    }
    renameFieldToPK(qb) {
        if (this.prop.reference === entity_1.ReferenceType.MANY_TO_MANY) {
            const pivotTable = this.prop.pivotTable;
            const alias = qb.getAliasForEntity(pivotTable, this);
            return utils_1.Utils.getPrimaryKeyHash(this.prop.inverseJoinColumns.map(col => `${alias}.${col}`));
        }
        if (this.prop.joinColumns.length > 1) {
            return utils_1.Utils.getPrimaryKeyHash(this.prop.joinColumns);
        }
        const meta = this.metadata.get(this.prop.type);
        const alias = qb.getAliasForEntity(meta.name, this);
        const pks = utils_1.Utils.flatten(meta.primaryKeys.map(primaryKey => meta.properties[primaryKey].fieldNames));
        return utils_1.Utils.getPrimaryKeyHash(pks.map(col => `${alias}.${col}`));
    }
    getPath() {
        let ret = this.parent && this.prop ? this.prop.name : this.entityName;
        if (this.parent instanceof ArrayCriteriaNode && this.parent.parent && !this.key) {
            ret = this.parent.parent.key;
        }
        if (this.parent) {
            const parentPath = this.parent.getPath();
            if (parentPath) {
                ret = this.parent.getPath() + '.' + ret;
            }
            else if (this.parent.entityName && ret) {
                ret = this.parent.entityName + '.' + ret;
            }
        }
        return ret;
    }
    [util_1.inspect.custom]() {
        return `${this.constructor.name} ${util_1.inspect({ entityName: this.entityName, key: this.key, payload: this.payload })}`;
    }
}
exports.CriteriaNode = CriteriaNode;
class ScalarCriteriaNode extends CriteriaNode {
    static create(metadata, entityName, payload, parent, key) {
        const node = new ScalarCriteriaNode(metadata, entityName, parent, key);
        node.payload = payload;
        return node;
    }
    process(qb, alias) {
        if (this.shouldJoin()) {
            const nestedAlias = qb.getAliasForEntity(this.entityName, this) || qb.getNextAlias();
            const field = `${alias}.${this.prop.name}`;
            if (this.prop.reference === entity_1.ReferenceType.MANY_TO_MANY) {
                qb.join(field, nestedAlias, undefined, 'pivotJoin', this.getPath());
            }
            else {
                qb.join(field, nestedAlias, undefined, 'leftJoin', this.getPath());
            }
            if (this.prop.reference === entity_1.ReferenceType.ONE_TO_ONE) {
                qb.addSelect(field);
            }
        }
        return this.payload;
    }
    shouldJoin() {
        if (!this.parent || !this.prop || [entity_1.ReferenceType.SCALAR, entity_1.ReferenceType.ONE_TO_MANY].includes(this.prop.reference)) {
            return false;
        }
        if (this.prop.reference === entity_1.ReferenceType.ONE_TO_ONE) {
            return !this.prop.owner;
        }
        return this.prop.reference === entity_1.ReferenceType.MANY_TO_MANY;
    }
}
exports.ScalarCriteriaNode = ScalarCriteriaNode;
class ArrayCriteriaNode extends CriteriaNode {
    static create(metadata, entityName, payload, parent, key) {
        const node = new ArrayCriteriaNode(metadata, entityName, parent, key);
        node.payload = payload.map(item => CriteriaNode.create(metadata, entityName, item, node));
        return node;
    }
    process(qb, alias) {
        return this.payload.map((node) => {
            return node.process(qb, alias);
        });
    }
    getPath() {
        if (this.parent && this.parent.parent) {
            return this.parent.parent.getPath();
        }
        return '';
    }
}
exports.ArrayCriteriaNode = ArrayCriteriaNode;
class ObjectCriteriaNode extends CriteriaNode {
    static create(metadata, entityName, payload, parent, key) {
        const node = new ObjectCriteriaNode(metadata, entityName, parent, key);
        const meta = metadata.get(entityName, false, false);
        node.payload = Object.keys(payload).reduce((o, item) => {
            const prop = meta && meta.properties[item];
            const childEntity = prop && prop.reference !== entity_1.ReferenceType.SCALAR ? prop.type : entityName;
            o[item] = CriteriaNode.create(metadata, childEntity, payload[item], node, item);
            return o;
        }, {});
        return node;
    }
    process(qb, alias) {
        const nestedAlias = qb.getAliasForEntity(this.entityName, this);
        const ownerAlias = alias || qb.alias;
        if (nestedAlias) {
            alias = nestedAlias;
        }
        if (this.shouldAutoJoin(nestedAlias)) {
            alias = this.autoJoin(qb, ownerAlias);
        }
        return Object.keys(this.payload).reduce((o, field) => {
            const childNode = this.payload[field];
            const payload = childNode.process(qb, this.prop ? alias : ownerAlias);
            const operator = QueryBuilderHelper_1.QueryBuilderHelper.isOperator(field);
            const customExpression = QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(field);
            if (childNode.shouldInline(payload)) {
                Object.assign(o, payload);
            }
            else if (childNode.shouldRename(payload)) {
                o[childNode.renameFieldToPK(qb)] = payload;
            }
            else if (operator || customExpression || field.includes('.') || ![enums_1.QueryType.SELECT, enums_1.QueryType.COUNT].includes(qb.type)) {
                o[field] = payload;
            }
            else {
                o[`${alias}.${field}`] = payload;
            }
            return o;
        }, {});
    }
    shouldInline(payload) {
        const customExpression = QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(this.key);
        const scalar = utils_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        const operator = utils_1.Utils.isObject(payload) && Object.keys(payload).every(k => QueryBuilderHelper_1.QueryBuilderHelper.isOperator(k, false));
        return !!this.prop && this.prop.reference !== entity_1.ReferenceType.SCALAR && !scalar && !operator;
    }
    shouldAutoJoin(nestedAlias) {
        if (!this.prop || !this.parent) {
            return false;
        }
        const knownKey = [entity_1.ReferenceType.SCALAR, entity_1.ReferenceType.MANY_TO_ONE].includes(this.prop.reference) || (this.prop.reference === entity_1.ReferenceType.ONE_TO_ONE && this.prop.owner);
        const composite = this.prop.joinColumns && this.prop.joinColumns.length > 1;
        const operatorKeys = knownKey && Object.keys(this.payload).every(key => QueryBuilderHelper_1.QueryBuilderHelper.isOperator(key, false));
        return !nestedAlias && !operatorKeys && !composite;
    }
    autoJoin(qb, alias) {
        const nestedAlias = qb.getNextAlias();
        const customExpression = QueryBuilderHelper_1.QueryBuilderHelper.isCustomExpression(this.key);
        const scalar = utils_1.Utils.isPrimaryKey(this.payload) || this.payload instanceof RegExp || this.payload instanceof Date || customExpression;
        const operator = utils_1.Utils.isObject(this.payload) && Object.keys(this.payload).every(k => QueryBuilderHelper_1.QueryBuilderHelper.isOperator(k, false));
        const field = `${alias}.${this.prop.name}`;
        if (this.prop.reference === entity_1.ReferenceType.MANY_TO_MANY && (scalar || operator)) {
            qb.join(field, nestedAlias, undefined, 'pivotJoin', this.getPath());
        }
        else {
            const prev = qb._fields.slice();
            qb.join(field, nestedAlias, undefined, 'leftJoin', this.getPath());
            qb._fields = prev;
        }
        return nestedAlias;
    }
}
exports.ObjectCriteriaNode = ObjectCriteriaNode;
